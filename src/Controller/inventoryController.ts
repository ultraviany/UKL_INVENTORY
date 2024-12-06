import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createBorrow = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, item_id } = req.body
        const borrow_date : Date = new Date(req.body.borrow_date)
        const return_date : Date = new Date(req.body.return_date)

        const findUser = await prisma.user.findFirst({
            where: { id: user_id }
        })

        if(!findUser) {
            res.status(404).json({ 
                message: "User not found" 
            })
            return
        }

        const findItem = await prisma.items.findFirst({
            where: { id: item_id }
        })

        if(!findItem) {
            res.status(404).json({
                message: "Item not found"
            })
            return
        }

        const borrow = await prisma.borrowRecord.create({
            data: {
                user_id: user_id,
                item_id: item_id,
                borrow_date,
                return_date
            }
        })

        res.status(201).json({
            status: `succes`,
            message: `Peminjaman berhasil dicatat`,
            data: borrow
        })
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}

const returnItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const borrow_id = req.body.borrow_id

        const findBorrow = await prisma.borrowRecord.findFirst({
            where: { borrow_id: Number(borrow_id) }
        })

        if(!findBorrow) {
            res.status(404).json({
                message: "Record peminjaman not found"
            })
            return
        }

        const return_date : Date = new Date(req.body.return_date)

        const createReturnRecord = await prisma.returnRecord.create({
            data: {
                borrow_id: Number(borrow_id),
                actual_return_date: return_date,
                user_id: findBorrow.user_id,
                item_id: findBorrow.item_id
            }
        })

        res.status(200).json({
            status: `succes`,
            message: `Pengembalian berhasil`,
            data: createReturnRecord
        })
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}

const analyzeUsage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { start_date, end_date, group_by } = req.body;

        // Ambil data BorrowRecord sesuai tanggal
        const borrowData = await prisma.borrowRecord.findMany({
            where: {
                borrow_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date),
                },
            },
            include: {
                item: true, // Include relation ke tabel Items
            },
        });

        const returnData = await prisma.returnRecord.findMany({
            where: {
                actual_return_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date),
                },
            },
        });

        // Grup data berdasarkan `group_by`
        const groupedData = borrowData.reduce((acc: Record<string, any>, borrow) => {
            const group = borrow.item[group_by as keyof typeof borrow.item] as string; // Type assertion
            if (!acc[group]) {
                acc[group] = {
                    group,
                    total_borrowed: 0,
                    total_returned: 0,
                    items_in_use: 0,
                };
            }

            acc[group].total_borrowed++;
            if (returnData.some((r) => r.borrow_id === borrow.borrow_id)) {
                acc[group].total_returned++;
            } else {
                acc[group].items_in_use++;
            }

            return acc;
        }, {});

        // Ubah objek menjadi array
        const usageAnalysis = Object.values(groupedData);

        // Format respons
        res.status(200).json({
            status: "success",
            data: {
                analysis_period: {
                    start_date,
                    end_date,
                },
                usage_analysis: usageAnalysis,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

const analyzeItemUsage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { start_date, end_date } = req.body;

        // Validasi input
        if (!start_date || !end_date) {
            res.status(400).json({
                message: "start_date and end_date are required",
            });
            return;
        }

        // Ambil data peminjaman dan pengembalian
        const borrowData = await prisma.borrowRecord.findMany({
            where: {
                borrow_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date),
                },
            },
            include: {
                item: true, // Sertakan detail item
            },
        });

        const returnData = await prisma.returnRecord.findMany({
            where: {
                actual_return_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date),
                },
            },
        });

        // Hitung item yang sering dipinjam
        const frequentlyBorrowedItems: Record<number, any> = {};
        borrowData.forEach((borrow) => {
            const itemId = borrow.item_id;
            if (!frequentlyBorrowedItems[itemId]) {
                frequentlyBorrowedItems[itemId] = {
                    item_id: itemId,
                    name: borrow.item.name,
                    category: borrow.item.category,
                    total_borrowed: 0,
                };
            }
            frequentlyBorrowedItems[itemId].total_borrowed++;
        });

        // Hitung item yang tidak efisien
        const inefficientItems: Record<number, any> = {};
        borrowData.forEach((borrow) => {
            const itemId = borrow.item_id;
            if (!inefficientItems[itemId]) {
                inefficientItems[itemId] = {
                    item_id: itemId,
                    name: borrow.item.name,
                    category: borrow.item.category,
                    total_borrowed: 0,
                    total_late_returns: 0,
                };
            }
            inefficientItems[itemId].total_borrowed++;

            // Cek apakah item memiliki pengembalian terlambat
            const returnRecord = returnData.find((r) => r.borrow_id === borrow.borrow_id);
            if (returnRecord && new Date(returnRecord.actual_return_date) > new Date(borrow.return_date)) {
                inefficientItems[itemId].total_late_returns++;
            }
        });

        // Ubah hasil ke array
        const frequentItemsArray = Object.values(frequentlyBorrowedItems);
        const inefficientItemsArray = Object.values(inefficientItems).filter(
            (item: any) => item.total_late_returns > 0
        );

        // Format respons
        res.status(200).json({
            status: "success",
            data: {
                analysis_period: {
                    start_date,
                    end_date,
                },
                frequently_borrowed_items: frequentItemsArray,
                inefficient_items: inefficientItemsArray,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

export {createBorrow, returnItem, analyzeUsage, analyzeItemUsage}