const fs = require('fs');
const path = require('path');

const replacements = {
  // Aliases and mappings to real exercise IDs
  "'flexao-padrao'": "'pushup'",
  "'flexao-diamante'": "'diamondpushup'",
  "'remada-invertida-padrao'": "'australianpullup'",
  "'dead-hang-ativo'": "'retracao-escapular-barra'",
  "'flexao-parede-punho-fechado'": "'flexao-parede'",
  "'flexao-parede-amplitude-parcial'": "'flexao-parede'",
  "'flexao-inclinada-paralelas'": "'flexao-inclinada'",
  "'flexao-inclinada-degrau-alto'": "'flexao-parede'",
  "'flexao-inclinada-mesa'": "'flexao-inclinada'",
  "'flexao-joelhos-punho-fechado'": "'flexao-joelhos'",
  "'flexao-paralelas-neutra'": "'dip-banco-chao'",
  "'flexao-punho-fechado'": "'pushup'",
  "'flexao-fechada-paralelas'": "'flexao-fechada'",
  "'flexao-declinada-paralelas'": "'flexao-declinada'",
  "'flexao-declinada-cadeira'": "'flexao-declinada'",
  "'flexao-paralelas'": "'dip-paralela'",
  "'flexao-escapular-antebraço'": "'flexao-escapular'",
  "'flexao-padrao-paralelas'": "'pushup'",
  "'flexao-arqueiro-paralelas'": "'flexao-arqueiro'",
  "'pppu-paralelas-parallettes'": "'flexao-pseudo-planche'",
  "'flexao-unilateral-paralela'": "'flexao-unilateral-assistida'",
  "'pike-pushup-paralelas'": "'pikepushup'",
  "'pike-elevado-paralelas'": "'pike-pushup-elevado'",
  "'pike-pushup-elevado-sofa'": "'pike-pushup-elevado'",
  "'prancha-peito-parede-paralelas'": "'prancha-peito-parede'",
  "'handstand-paralelas'": "'handstand'",
  "'hspu-negativa-paralelas'": "'hspu-negativa-parede'",
  "'hspu-paralelas'": "'hspu-parcial-parede'",
  "'handstand-livre-paralelas'": "'handstand-livre'",
  "'hspu-livre-paralelas'": "'hspu-livre'",
  "'dip-banco-cadeira'": "'dip-banco-chao'",
  "'dip-banco-duas-cadeiras'": "'dip-banco-elevado'",
  "'dip-mochila-com-peso'": "'dip-com-carga'",
  "'dead-hang-pes-no-chao'": "'dead-hang'",
  "'dead-hang-argolas'": "'dead-hang'",
  "'retracao-escapular-argolas'": "'retracao-escapular-barra'",
  "'remada-porta-toalha-em-pe'": "'remada-porta-toalha'"
};

const dir = path.join(__dirname, '../src/data/exercises');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const full = path.join(dir, file);
  let content = fs.readFileSync(full, 'utf8');
  let changed = false;
  for (const [from, to] of Object.entries(replacements)) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(full, content, 'utf8');
    console.log(`Updated references in ${file}`);
  }
}

