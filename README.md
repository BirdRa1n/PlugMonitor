# PlugMonitor

PlugMonitor é um aplicativo desktop desenvolvido com Electron para monitoramento em tempo real do consumo elétrico de uma tomada, utilizando comunicação via porta serial. O objetivo é fornecer uma interface simples e intuitiva para visualizar dados de consumo e identificar padrões ou anomalias no uso de energia.

## Tecnologias

- **Electron**: Framework para construção de aplicativos desktop multiplataforma.
- **Node.js**: Ambiente de execução para JavaScript no backend.
- **serialport**: Biblioteca para comunicação com dispositivos via porta serial.
- **TypeScript**: Superset de JavaScript para tipagem estática (indicado pelo `tsconfig.json`).
- **HTML/CSS**: Interface gráfica do aplicativo.

## Pré-requisitos

- **Node.js** (v16 ou superior)
- **npm** (gerenciador de pacotes do Node.js)
- **Git** (para clonar o repositório)
- Um dispositivo conectado via porta serial (ex.: Arduino enviando dados de consumo elétrico)
- **TypeScript** (para compilar o código, caso esteja usando TypeScript)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/birdra1n/PlugMonitor.git
   ```
2. Acesse o diretório do projeto:
   ```bash
   cd plugmonitor
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

## Como Executar

1. Certifique-se de que o dispositivo está conectado à porta serial correta (ex.: `COM3` no Windows ou `/dev/ttyUSB0` no Linux/macOS).
2. Compile o código TypeScript (se necessário):
   ```bash
   npm run build
   ```
3. Inicie o aplicativo:
   ```bash
   npm start
   ```
4. O aplicativo abrirá uma janela com a interface gráfica, exibindo os dados de consumo elétrico recebidos via porta serial.

## Estrutura do Projeto

```
plugmonitor/
├── app/                  # Código-fonte principal do aplicativo
├── electron-builder.yml   # Configuração para empacotamento do Electron
├── LICENSE               # Licença do projeto (MIT)
├── main/                 # Código do processo principal do Electron
├── node_modules/         # Dependências do projeto
├── package-lock.json     # Lockfile para versões exatas das dependências
├── package.json          # Configuração do projeto e scripts npm
├── README.md             # Documentação do projeto
├── renderer/             # Código do processo de renderização (interface gráfica)
├── resources/            # Recursos estáticos (ex.: ícones, imagens)
├── tsconfig.json         # Configuração do TypeScript
```

## Scripts Disponíveis

No `package.json`, você pode encontrar os seguintes scripts úteis:
- `npm start`: Inicia o aplicativo em modo de desenvolvimento.
- `npm run build`: Compila o código TypeScript (se aplicável).
- `npm run dist`: Gera o executável do aplicativo usando o `electron-builder` (configurado no `electron-builder.yml`).

## Status do Projeto

Em desenvolvimento. Funcionalidades planejadas:
- Exibição de dados de consumo em tempo real com gráficos interativos.
- Alertas para picos de consumo.
- Exportação de dados para análise (ex.: CSV ou JSON).
- Configuração de porta serial via interface gráfica.

## Contribuição

Contribuições são bem-vindas! Para contribuir:
1. Faça um fork do repositório.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Commit suas mudanças: `git commit -m "Adiciona minha feature"`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato

Para dúvidas ou sugestões, entre em contato com o mantenedor do projeto:  
[BirdRa1n](https://github.com/birdra1n) - [birdra1n@protonmail.com](mailto:birdra1n@protonmail.com)
