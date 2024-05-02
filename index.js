const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.routes.js");
const statementRouter = require('./routes/statement.routes.js');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRouter);
app.use('/api/statements', statementRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
