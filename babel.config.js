module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  ignore: [
    '/node_modules/(?!nanoid|other-dep)/', // Aqui também, adicione o 'nanoid' e outras dependências
  ],
};
