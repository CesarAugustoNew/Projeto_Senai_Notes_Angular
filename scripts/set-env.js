// Roda antes do "ng build" (veja o script "build" no package.json).
// Lê a variável de ambiente API_URL (configurada no painel da Vercel) e
// escreve o valor real dentro de environment.prod.ts, que é o arquivo que o
// Angular usa quando builda em modo produção. Sem isso, precisaríamos deixar
// a URL da API fixa ("hardcoded") no código-fonte.
const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || 'http://localhost:8080';

const filePath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const content = `// Arquivo gerado automaticamente por scripts/set-env.js — não edite à mão.
export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(filePath, content);
console.log(`[set-env] environment.prod.ts gerado com apiUrl = ${apiUrl}`);
