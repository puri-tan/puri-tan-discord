<p align="center">
  <a href="https://github.com/puri-tan/puri-tan-discord">
    <img src="https://res.cloudinary.com/puri-tan/image/upload/v1614533501/puri-tan-chibi-02.png" alt="Logo" width="126" height="145">
  </a>

  <h3 align="center">Puri-tan</h3>

  <p align="center">
    Um bot para auxiliar a edificação da comunidade cristã online
    <br />
    <a href="https://discord.com/api/oauth2/authorize?client_id=808023709948182619&permissions=8&scope=bot"><strong>Convidar para o seu servidor</strong></a>
    <br />
    <br />
    <a href="https://github.com/puri-tan/puri-tan-discord/issues">Reportar bug</a>
    ·
    <a href="https://discord.gg/9Qbm7Rbjky">Servidor oficial</a>
    ·
    <a href="mailto:ismaelcarlosvelten@gmail.com">Entrar em contato</a>
  </p>
</p>

## Sobre o projeto

Existem muitos bots ótimos para leitura da Bíblia na Internet. Porém, até o momento da idealização deste projeto, todos os conhecidos estavam limitados à cultura inglesa. Além disso, havia o desejo de auxiliar em mais que apenas a leitura da palavra.

Este projeto surgiu com o desejo de auxiliar a comunidade cristã online do Brasil em diversas plataformas de conversa (sendo o Discord a primeira delas), através de um bot que seja um influenciador e auxiliar de edificação, compartilhando devocionais e pregações, interagindo com os usuários de maneira a edificar a fé e os bons costumes e atraindo joves e crianças para o cristianismo, criando um ambiente agradável com um personagem fictício que as estimule a buscar e valorizar o Evangelho.

### Ferramentas utilizadas na construção

Este bot foi feito com um stack de tecnologia simples e eficiente. Todo o core do sistema foi projetado em [Node.js](https://nodejs.org/en/), escrito em CommonJS. A razão de não usar Modules para isso é porque nosso serviço de hospedagem oficial não os suporta. É provável que isso mude no futuro, se houverem novas possibilidades ou evolução da tecnologia do servidor.

Para ler a Bíblia, o bot utiliza a [Bible API](https://bibleapi.co/).

### Instância oficial

Temos uma instância oficial do bot sendo executada 24 por dia. Você pode convidá-la livremente para seu servidor, bastando usar o link de Convite no início deste documento.

### Como utilizar este projeto

Para executar o bot, é necessário primeiro [criar uma conta de bot na página de desenvolvedores do Discord](https://discord.com/developers/docs/intro#bots-and-apps).

Após criar o bot, renomeie o arquivo [.env.template](.env.template) para `.env`. Abra o arquivo e coloque na variável `BOT_TOKEN` o token de acesso do bot criado no portal de desenvolvedor do Discord.

Em seguida, é necessário configurar uma conta de acesso na [Bible API](https://bibleapi.co/), obtendo assim um token de acesso. Este token deve ser colocado na variável `BIBLE_API_TOKEN`

Opcionalmente, você pode alterar a URL da Bible API caso esteja disponibilizando ela em outro local (o projeto é open-source) através da variável `BIBLE_API_URL`.

Também é possível alterar a versão da bíblia que está sendo usada na leitura, sendo a padrão a versão NVI. Consulte as versões disponíveis pelo portal da Bible API e defina a versão desejada na variável `BIBLE_DEFAULT_VERSION`.

Por fim, defina o ID de contato da sua conta de administrador no Discord na variável `ADMIN_ID`.

Para executar o bot localmente, basta então executar o comando `node bot.js`.

## Colaboradores

Atualmente, Puri-tan é construída por dois colaboradores principais:

* [Ismael Carlos Velten](https://github.com/ivelten): autor deste repositório e o responsável pela manutenção do código do sistema do bot. Desenvolvedor de software a mais de 12 anos, tem buscado oportunidades de fazer projetos abertos que busquem divulgar o Evangelho e auxiliar Cristãos em sua vida devocional.

* [Karolyne da Rocha Bastos](https://karolynerocha.carrd.co/): autora da identidade visual de Puri-tan, Karolyne é uma Ilustradora freelance que  se dedica a diversos projetos, sendo o mais famoso o [Balsamus Comic](https://balsamuscomic.carrd.co/), baseado na cultura do oriente médio antigo. A intenção compartilhada de buscar oportunidades em projetos cristãos a trouxe como participante deste projeto.

Além destes, outros colaboradores estão participando dos testes e sugestões de features, dentre os quais destacamos por sua participação no servidor oficial:

* Sara Hu Mia
* Maycon Bruno
* Jennifer Kelly
* Samara Parcero
