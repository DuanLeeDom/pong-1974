# Pong - 1974

<img src="https://github.com/user-attachments/assets/338808aa-df9d-440d-95e1-a9f230d44e17" alt="img:pong-screenshot-1" height="350">
<img src="https://github.com/user-attachments/assets/b847163b-422e-40e1-a650-47df7c7db85a" alt="img:pong-screenshot-2" height="350">

## Contexto

Este projeto foi desenvolvido como parte de uma atividade acadêmica com o objetivo de recriar um jogo web simples. Inspirado no clássico Pong, lançado em 1972 pela Atari, esta versão oferece uma experiência minimalista e nostálgica, simulando uma partida de tênis virtual entre dois jogadores.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando tecnologias web padrão:

- **HTML**: Responsável pela estrutura da interface (campo, raquetes, bola, placar).
- **CSS**: Define o estilo visual com um design retrô, remetendo à estética dos anos 1970, utilizando fontes como Micro 5 e uma paleta de cores contrastante.
- **JavaScript**: Implementa toda a lógica do jogo, como movimentação das raquetes, física da bola, detecção de colisões, controle de placar e funcionalidades adicionais.

## Funcionamento do Jogo

Pong - 1974 é um jogo local para dois jogadores. O objetivo é impedir que a bola ultrapasse a própria raquete, marcando pontos quando o adversário não conseguir interceptar a bola.

### Controles

- **Jogador 1 (raquete esquerda)**: teclas `W` (cima) e `S` (baixo)
- **Jogador 2 (raquete direita)**: teclas `↑` (cima) e `↓` (baixo)

### Mecânicas

- A bola acelera gradualmente a cada rebatida, até atingir uma velocidade máxima.
- O ângulo da bola varia de acordo com o ponto de impacto na raquete, tornando a partida mais dinâmica.
- Os pontos são contabilizados automaticamente quando a bola ultrapassa a raquete do adversário.

### Funcionalidades Adicionais

- **Modo de depuração**: Ativado com a tecla `I`, exibe informações como coordenadas e dimensões dos elementos.
- **Reinício da partida**: Teclas `Escape` ou `P` reiniciam o jogo, zerando o placar e reposicionando os elementos.

### Responsividade

O jogo adapta automaticamente os elementos visuais conforme o tamanho da janela do navegador, garantindo compatibilidade com diferentes resoluções de tela.

## Instruções para Execução Local

1. **Download ou clonagem do projeto**

   Faça o download dos arquivos `index.html`, `jogo.js` e `configura.css`, ou clone o repositório, se disponível.

2. **Organização dos arquivos**

   Certifique-se de que os três arquivos estejam no mesmo diretório. Caso utilize uma estrutura diferente, ajuste os caminhos nos atributos `src` e `href` do arquivo `index.html`.

3. **Execução em navegador**

   Abra o arquivo `index.html` em um navegador moderno (Google Chrome, Mozilla Firefox, Microsoft Edge).

   Para evitar restrições de segurança (CORS), recomenda-se utilizar um servidor local. Exemplos:

   - **Python**:
     ```bash
     python -m http.server 8000
     ```
     Acesse: http://localhost:8000

   - **Node.js (http-server)**:
     ```bash
     npx http-server
     ```

4. **Início da partida**

   Após o carregamento, pressione as teclas indicadas para controlar as raquetes. Utilize `I` para depurar e `Escape` ou `P` para reiniciar.


## Considerações Finais

- Este projeto foi desenvolvido com foco na simplicidade e na fidelidade ao conceito original do Pong.
- A fonte Micro 5 é carregada via Google Fonts, sendo necessária conexão com a internet para sua correta renderização. Para uso offline, recomenda-se substituir por uma fonte local.
- O jogo não depende de bibliotecas externas e foi testado em navegadores modernos.

## Licença

Este projeto foi desenvolvido com fins exclusivamente acadêmicos e não possui uma licença formal. Está disponível para fins de estudo e referência, respeitando-se os créditos e o contexto educacional original.

## Autor

**Duan Lee Dom da Silva**  
Disciplina: Eletiva - Programação de Scripts  
Ano: 2025
