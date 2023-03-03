const fs = require('fs');

const validateProposalId = (proposal) => {
    proposal = String(proposal);

    // Extrai os dois últimos dígitos do código da proposta
    console.log("separates the check code");
    const code = proposal.substring(proposal.length - 2);
    console.log("code", code);

    // Separa os outros dígitos do código da proposta em um array
    console.log("separate the other digits");
    const arrNumbers = proposal.split("");
    var sumEven = 0;
    var sumOdd = 0;

    // Soma os valores dos dígitos pares e ímpares
    console.log("Add the even and odd values");
    arrNumbers.forEach(element => {
        if (element % 2 === 0) {
            sumEven += element;
        } else {
            sumOdd += element;
        }
    });

    console.log("even", sumEven, "odd", sumOdd);

    // Calcula o código de verificação a partir da diferença entre a soma dos dígitos pares e ímpares
    var verifyCode = 0;
    if (sumEven > sumOdd) {
        verifyCode = (sumEven - sumOdd) / 2;
    } else {
        verifyCode = (sumOdd - sumEven) / 2;
    }

    verifyCode = Math.round(verifyCode);

    console.log("verifyCode", verifyCode);
    return code === String(verifyCode);
};

// Função para salvar as propostas em um arquivo e contar quantas são válidas e inválidas
const saveFileProposals = (path, proposals) => {
    let countValid = 0;
    let countInvalid = 0;

    // Itera sobre as propostas
    proposals.forEach(element => {
        let verifyCode = "00" + element.produto.nrVersaoOferta

        // Concatena o código da proposta com o código de verificação
        let proposal = element.propostaId + verifyCode.substring(verifyCode.length - 2);

        // Valida a proposta e conta se é válida ou inválida
        if (validateProposalId(proposal)) {
            console.log("proposal:", proposal, "Valid");
            countValid++;
        } else {
            console.log("proposal:", proposal, "Invalid");
            countInvalid++;
        }
    })

    // Escreve as propostas em um arquivo
    fs.writeFileSync(path, JSON.stringify(proposals));

    console.log("valid:", countValid, "invalid:", countInvalid);
    return {
        valid: countValid,
        invalid: countInvalid
    }
}

// Função para carregar as propostas válidas de um arquivo
const loadValidProposals = (path) => {
    const fileData = fs.readFileSync(path, 'utf8');
    const proposals = JSON.parse(fileData);
    return proposals.filter(p => validateProposalId(p.propostaId));
}

// Exporta as funções para serem usadas em outros arquivos
module.exports.validateProposalId = validateProposalId;
module.exports.saveFileValidProposals = saveFileProposals;
