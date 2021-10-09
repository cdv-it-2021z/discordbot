- [Discord bot dla serwera CDV inf zaoczne 2021](#discord-bot-dla-serwera-cdv-inf-zaoczne-2021)
- [Tworzenie komendy](#tworzenie-komendy)
  - [Podstawowy Wzór](#podstawowy-wzór)
    - [Przykładowa komenda `/ping`:](#przykładowa-komenda-ping)
  - [Testowanie komendy](#testowanie-komendy)

--- 

# Discord bot dla serwera CDV inf zaoczne 2021
Bot stworzony aby ułatwić wszystkim użytkowanie serwera discordowego dla całego rocznika informatycznego na niestacjonarnych studiach.  
Każda osoba z minimalnymi umiejętnościami ma możliwość dodania własnych komend lub modułów, które zostaną zaimplementowane w tym programie.  
  
Osobami odpowiedzialnymi za obsługę i ogół projektu są:  
> Dawid P. - [kvpsky](https://github.com/kvpsky)  
> Miłosz W. - [Wisienek](https://www.github.com/wisienek/)


# Tworzenie komendy

## Podstawowy Wzór

Każda komenda powinna mieć przynajmniej 3 wartości exportowalne:
* **data** - obiekt [`SlashCommandBuilder`](https://discord.js.org/#/docs/main/stable/typedef/ApplicationCommandData)
* **permission** - [permissia discordowa](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)  
  np. `ADMINISTRATOR `, `PRIORITY_SPEAKER`
* **execute** - funkcja() z wykonaniem

```js
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("Nazwa")
        .setDescription("Opis")
        .setDefaultPermission(true),
    permission: "SEND_MESSAGES",
    execute(i) {
        return;
    }
}
```

### Przykładowa komenda `/ping`:

```js
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Testowa komenda")
        .setDefaultPermission(false),
    permission: "ADMINISTRATOR",
    async execute(i) {
        await i.reply({content: "Pong!"});
    }
}
```

`data` musi zawierać obiekt typu `SlashCommandBuilder()` z przynajmniej ustawioną  
nazwą: `.setName("nazwa")`,   
opisem: `.setDescription("twój opis")`,  
i początkowym stanem permissi: `.setDefaultPermission(boolean)`.

Funkcja `execute()` może przyjmować argument [`interaction`](https://discord.js.org/#/docs/main/13.2.0/class/Interaction), lub w skrócie `i`, który jest obiektem interakcji dostarczonym prosto z eventu [`interactionCreate`](https://discord.js.org/#/docs/main/13.2.0/class/Client?scrollTo=e-interactionCreate).

## Testowanie komendy

Oczywistym sposobem na przetestowanie danej interakcji jest zwykłe wpisanie jej w chat discordowy i oczekiwanie na reakcje.  
Lepszym rozwiązaniem jednak może stać się test automatyczny, który znajduje się w folderze `./tests/src/` pod nazwą `commands.test.ts`.  

Aby włączyć taki test wystarczy wpisać w konsolę odpowiednią komendę:  
  
Dla uruchomienia *wszystkich* testów:
```properties
npm test
```

Dla *pojedyńcczego* testu:
```properties
jest -t 'commands'
```