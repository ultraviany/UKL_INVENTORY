import Express from "express"
import UserRoute from "./Router/UserRoute"
import InventoryRouter from "./Router/InventoryRouter"
import ItemRouter from "./Router/itemsRouter"
const app = Express()
/**allow to read a body request with
 * JSON format
 */
app.use(Express.json())
app.use(`/User`, UserRoute)
app.use(`/Inventory`,InventoryRouter )
app.use(`/Item`,ItemRouter )


const PORT = 1992   
app.listen(PORT, () => {
    console.log(`Server InventarisBarang run on port ${PORT}`)
})