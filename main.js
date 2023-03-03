const express = require("express");
const fs = require("fs");
const utils = require("./utils");
const port = 3003;
console.log("Starting app on port:", port);

const app = express();

app.use(express.json());

// Definindo um endpoint POST que recebe uma lista de propostas para validação
app.post("/api/proposta/validar", function (req, res) {

    // Extrai a lista de propostas do corpo da requisição
    const proposals = req.body.propostas;

    // Imprime a lista de propostas recebidas no console
    console.log("propostas received:", JSON.stringify(proposals));

    // Salva as propostas válidas em um arquivo JSON usando uma função do módulo 'utils'
    const result = utils.saveFileValidProposals('./json/proposals.json', proposals);

    // Imprime o resultado da validação no console (incluindo as propostas inválidas)
    console.log("result:", JSON.stringify(result));

    // Retorna o resultado da validação como um objeto JSON
    res.json(result);
});

// Definindo um endpoint GET que recebe o número de proposta e retorna o objeto 'produto'
app.get('/api/proposta/:proposta/produto', function(req, res) {

  // Extrai o número da proposta dos parâmetros da URL
  const proposalId = req.params.proposta;

  // Carrega as propostas válidas do arquivo JSON usando uma função do módulo 'utils'
  const proposals = utils.loadValidProposals('./json/proposals.json');

  // Encontra a proposta com o 'propostaId' correspondente
  const proposal = proposals.find(p => p.propostaId === parseInt(proposalId));

  // Se a proposta não for encontrada, retorna uma mensagem de erro com status 404
  if (!proposal) {
    res.status(404).send('Proposal not found');
    return;
  }

  // Extrai o objeto 'produto' da proposta encontrada
  const produto = proposal.produto;

  // Retorna o objeto 'produto' como um objeto JSON
  res.json({ produto });
});

// Inicia o servidor na porta especificada
app.listen(port);
