# PlugMonitor

<div align="center">
  <img src="resources/icon.png" alt="PlugMonitor Logo" width="128" height="128">
  
  **Monitor de Energia Elétrica em Tempo Real**
  
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/BirdRa1n/PlugMonitor/releases)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()
</div>

## 📋 Sobre o Projeto

PlugMonitor é um aplicativo desktop multiplataforma desenvolvido com Electron para monitoramento em tempo real do consumo elétrico através de comunicação serial. Oferece uma interface moderna e intuitiva para visualizar dados de consumo, configurar parâmetros do dispositivo e identificar padrões no uso de energia.

## ✨ Principais Funcionalidades

### 🔌 **Comunicação Serial Avançada**
- Detecção automática de portas seriais disponíveis
- Conexão/desconexão simples com dispositivos
- Comunicação bidirecional robusta
- Buffer inteligente para processamento de dados
- Suporte a múltiplas plataformas

### 📊 **Monitoramento em Tempo Real**
- **Corrente RMS (A)** - Medição precisa da corrente elétrica
- **Potência (W)** - Cálculo instantâneo do consumo
- **Energia (kWh)** - Registro acumulado do consumo total
- Atualização automática dos dados

### ⚙️ **Configurações do Dispositivo**
- Voltagem nominal configurável
- Fator de potência personalizável
- Sensibilidade do sensor ajustável
- Aplicação instantânea das configurações
- Recuperação automática das configurações

### 🎨 **Interface Moderna**
- Design responsivo com tema claro e escuro
- Componentes HeroUI para experiência nativa
- Indicadores visuais de status
- Cards organizados para fácil visualização
- Log em tempo real das comunicações

## 🛠️ Tecnologias Utilizadas

- **[Electron](https://electronjs.org/)** - Framework para aplicativos desktop multiplataforma
- **[Next.js](https://nextjs.org/)** - Framework React para o frontend
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[HeroUI](https://heroui.com/)** - Biblioteca de componentes React
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[SerialPort](https://serialport.io/)** - Biblioteca para comunicação serial
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animações

## 📋 Pré-requisitos

- **Node.js** v16 ou superior
- **npm** ou **yarn**
- **Git**
- Dispositivo compatível conectado via porta serial

## 🚀 Instalação e Execução

### Desenvolvimento

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/BirdRa1n/PlugMonitor.git
   cd PlugMonitor
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

### Build de Produção

```bash
# Build para todas as plataformas
npm run build

# Build específico por plataforma
npm run publish:win    # Windows
npm run publish:mac    # macOS
npm run publish:linux  # Linux
```

## 📁 Estrutura do Projeto

```
PlugMonitor/
├── main/                     # Processo principal do Electron
│   ├── background.ts         # Configuração da janela e IPC handlers
│   ├── preload.ts           # Script de preload para comunicação segura
│   └── helpers/             # Utilitários do processo principal
├── renderer/                # Processo de renderização (Frontend)
│   ├── components/          # Componentes React reutilizáveis
│   ├── contexts/            # Contextos React (Serial, etc.)
│   ├── hooks/               # Hooks customizados
│   ├── layouts/             # Layouts da aplicação
│   ├── pages/               # Páginas Next.js
│   ├── styles/              # Estilos globais
│   └── types/               # Definições de tipos TypeScript
├── resources/               # Recursos estáticos (ícones, imagens)
├── electron-builder.yml     # Configuração do build
└── package.json            # Configuração do projeto
```

## 🔧 Configuração do Dispositivo

O PlugMonitor se comunica com dispositivos via protocolo serial personalizado:

### Comandos Suportados
- `>GET_CONFIG` - Recupera configurações atuais
- `>SET_V,<valor>` - Define voltagem nominal
- `>SET_PF,<valor>` - Define fator de potência
- `>SET_SENS,<valor>` - Define sensibilidade do sensor
- `>CLEAR` - Limpa buffer de dados

### Formato de Dados Esperado
```
I_RMS: 1.234 A | P: 270.5 W | E: 0.001234 kWh
>CONFIG,V=220.0,PF=0.90,SENS=0.100
>OK,Configuração aplicada
>ERROR,Comando inválido
```

### Configurações Padrão
- **Baudrate**: 115200
- **Voltagem**: 220V
- **Fator de Potência**: 0.90
- **Sensibilidade**: 0.100 V/A

## 📱 Compatibilidade

| Plataforma | Versão Mínima | Formato |
|------------|---------------|---------|
| Windows    | 10/11 (x64)   | `.exe`  |
| macOS      | 10.15+        | `.dmg`  |
| Linux      | Ubuntu 18.04+ | `.AppImage`, `.deb` |

## 🎯 Casos de Uso

- **Monitoramento Residencial**: Acompanhe o consumo de equipamentos domésticos
- **Análise de Eficiência**: Identifique equipamentos com alto consumo
- **Detecção de Anomalias**: Monitore picos ou padrões incomuns
- **Projetos Educacionais**: Ferramenta para ensino sobre energia elétrica
- **Pesquisa e Desenvolvimento**: Coleta de dados para análise posterior

## 🔒 Segurança

- Comunicação IPC segura entre processos
- Validação rigorosa de dados recebidos
- Tratamento robusto de erros de comunicação
- Isolamento de contexto para segurança

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Diretrizes de Contribuição
- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use mensagens de commit descritivas

## 🐛 Reportar Problemas

Encontrou um bug? [Abra uma issue](https://github.com/BirdRa1n/PlugMonitor/issues) com:
- Descrição detalhada do problema
- Passos para reproduzir
- Sistema operacional e versão
- Logs relevantes (se disponíveis)

## 🗺️ Roadmap

### Versão 1.1.0
- [ ] Gráficos históricos de consumo
- [ ] Exportação de dados (CSV/JSON)
- [ ] Alertas configuráveis
- [ ] Múltiplos dispositivos simultâneos

### Versão 1.2.0
- [ ] API REST para integração
- [ ] Dashboard web
- [ ] Notificações push
- [ ] Relatórios automáticos

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE) - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**BirdRa1n**
- GitHub: [@BirdRa1n](https://github.com/BirdRa1n)
- Email: birdra1n@proton.me

## 🙏 Agradecimentos

- Comunidade Electron pela excelente documentação
- Equipe do Next.js pelo framework incrível
- Contribuidores do projeto SerialPort
- Todos que testaram e forneceram feedback

---

<div align="center">
  <p>Feito com ❤️ por <a href="https://github.com/BirdRa1n">BirdRa1n</a></p>
  <p>⭐ Se este projeto te ajudou, considere dar uma estrela!</p>
</div>
