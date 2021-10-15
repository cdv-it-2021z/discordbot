# Spis treści
- [Spis treści](#spis-treści)
- [Discord bot dla serwera CDV inf zaoczne 2021](#discord-bot-dla-serwera-cdv-inf-zaoczne-2021)
- [Tworzenie komendy](#tworzenie-komendy)
  - [Podstawowy Wzór](#podstawowy-wzór)
    - [Przykładowa komenda `/test`:](#przykładowa-komenda-test)
  - [Komenda z opcjami](#komenda-z-opcjami)
    - [opis](#opis)
    - [Kod komendy](#kod-komendy)
    - [Wyjaśnienie](#wyjaśnienie)
- [Tworzenie eventu](#tworzenie-eventu)
  - [Wzór](#wzór)
  - [Przykładowy event `Ready`](#przykładowy-event-ready)
    - [Opis](#opis-1)
    - [Kod](#kod)

--- 

# Discord bot dla serwera CDV inf zaoczne 2021
Bot stworzony aby ułatwić wszystkim użytkowanie serwera discordowego dla całego rocznika informatycznego na niestacjonarnych studiach.  
Każda osoba z minimalnymi umiejętnościami ma możliwość dodania własnych komend lub modułów, które zostaną zaimplementowane w tym programie.  
  
Osobami odpowiedzialnymi za obsługę i ogół projektu są:  
> Dawid P. - [kvpsky](https://github.com/kvpsky)  
> Miłosz W. - [Wisienek](https://www.github.com/wisienek/)


# Tworzenie komendy

## Podstawowy Wzór

Wzór komendy (interfejs):
```ts
interface Command {
    id?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    aliases?: string[];
    permission: PermissionResolvable
    run: {
        client: Bot;
        message: CommandInteraction;
        args?: any[];
    };
}
```

### Przykładowa komenda `/test`:

Przykładowa implementacja:
```ts
import { Permissions } from "discord.js";
import { Command } from "../Interfaces";

export const command: Command = {
    name: "test",
    description: "TEst command!",
    permission: Permissions.FLAGS.KICK_MEMBERS,
    run: async ({ message }) => {
        message.reply(`Tested!`);
    }
}
```
Najważniejsze cechy komendy to:  
`name` - nazwa komendy bez spacji, z małych liter,  
`description` - opis komendy,  
`permission` - [permissia](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS) do użycia,  
`run` - funckja wykonawcza

Dodatkowo można w komendzie opisać:  
`options` - [opcje](https://discord.js.org/#/docs/main/stable/typedef/CommandInteractionOption) komendy,  
`aliases` - aliasy (inne nazwy)


## Komenda z opcjami

### opis

Komenda tworzy Listener reakcji na wiadomości, aby wprowadzić podstawową weryfikacje wprowadzone zostały do niej opcje:  
`kanał` - kanał do oznaczenia, w którym jest wiadomość (potrzebne do cachowania),  
`msg_id` - id wiadomości aby podpiąć Listener,  
`emoji` - reaguje emoji na wiadomość i podpina nasłuchiwanie do niej,  
`rola` - rola do oznaczenia, jaką rolę ma dać/zabrać po kliknięciu na emoji

### Kod komendy

```ts
import { Permissions, TextChannel } from "discord.js";
import { Command, Listener } from "../Interfaces";

export const command: Command = {
    name: "roleonreaction",
    description: "Ustawia reakcję na danej wiadomości i daję/zabiera role po reakcji.",
    permission: Permissions.FLAGS.MANAGE_ROLES,
    options: [
        {
            type: "CHANNEL",
            name: "kanał",
            description: "W jakim kanale znajduje się wiadomość (oznacz go)",
            required: true
        },
        {
            type: "STRING",
            name: "msg_id",
            description: "ID wiadomości na jaką podłączyć listener.",
            required: true
        },
        {
            type: "STRING",
            name: "emoji",
            description: "Emoji do nadawania roli",
            required: true
        },
        {
            type: "ROLE",
            name: "rola",
            description: "Jaką rolę dać po kliknięciu na emotkę",
            required: true
        }
    ],
    run: async({ client, message }) => {
        if( message?.options?.data?.length == 4 ) {
            const channel = message.options.getChannel("kanał");
            const msgLink = message.options.getString("msg_id");
            const emoji = message.options.getString("emoji");
            const role = message.options.getRole("rola");

            const fetchedChannel =  client.Channels.get( channel.id ) || await message.guild.channels.fetch( channel.id ) as TextChannel;
            if( !fetchedChannel )
                return message.reply("Nie znaleziono kanału!");
            
            const fetchedMessage = client.Messages.get( msgLink ) || await fetchedChannel.messages.fetch( msgLink );
            if( !fetchedMessage ) 
                return message.reply("Nie znaleziono wiadomości!");

            const reacted = await fetchedMessage.react( emoji );
            if( !reacted?.count ) 
                return message.reply("Nie można było zareagować na wiadomość!");
            
            const isadded: Listener | null = await client.db.listener.findFirst({
                where: {
                    guild: message.guild.id,
                    channel: channel.id,
                    emoji,
                    role: role.id
                }
            });

            if( isadded ) 
                return message.reply(`Jest już taki listener ||id: ${isadded.id}|| !`);

            const item: Listener = await client.db.listener.create({ 
                data: {
                    id: client.listeners.length,
                    guild: message.guild.id,
                    channel: channel.id,
                    message: msgLink,
                    emoji,
                    role: role.id
                }
            });

            client.reactionListeners.push( item );

            message.reply(`Zapisano listener na kanale: <#${channel.id}> emotka: ${emoji} daje rolę: ${role.name}!`);
        } else {
            return message.reply("Za mało argumentów ;v");
        }
    }
}
```

### Wyjaśnienie

Wszystkie opcje znajdują się pod wiadomością, w opcji `message.options.data`,  
pobieramy ich wartości przez wpisanie odpowiendiego gettera np. `message.options.getString("nazwa_opcji")`. Getter jest ściśle powiązany z typem opcji, jaki określony został podczas wpisywania wszystkich opcji.

`FetchChannel as TextChannel` - fetchowanie kanału normalnie zwraca obiekt `Channel`, który składa się na super-kolekcję `TextChannel`, `VoiceChannel` itp. dlatego musimy określić jakiego dokładnie kanału oczekujemy.  

Komenda używa też zapisywania do bazy danych za pomocą klienta `@prisma`, który ułatwia sprawdzanie i zapisywanie danych.
wzór na posługiwanie się klientem wygląda mniej-więcej tak: `client.db.TWÓJMODEL.akcja`. Z uwagi, że klient prismy znajduje się jako zmienna `public readonly db` naszego bota zwracamy się do niego jako `client.db`, później określamy na jakim modelu chcemy działać i na końcu akcję np `.findMany()` czy `.createMany()`.

# Tworzenie eventu

## Wzór

```ts
import Bot from "../Client";
import { ClientEvents } from "discord.js";

interface Run {
    (client: Bot, ...args: any[]);
}

export interface Event {
    name: keyof ClientEvents;
    run: Run;
}
```

## Przykładowy event `Ready`

### Opis

Podany poniżej Event `Ready` ma za zadanie cachować kanały i wiadomości (dla komendy `/roleonreaction`) i rejestr wszystkich komend przez procedurę `registerCommands(client)`.

### Kod

```ts
import { TextChannel } from "discord.js";

import { Event } from "../Interfaces";
import { registerCommands } from "../functions/registerCommands";

export const event: Event = {
    name: "ready",
    run: async ( client ) => {
        console.info( `${client.user.username} online!` );

        for( const listener of client.reactionListeners ) {
            if( client.Messages.get(listener.message) ) continue;

            const channel = await client.channels.fetch(listener.channel) as TextChannel;
            const message = await channel.messages.fetch(listener.message);

            if( channel && message ){
                client.Channels.set(listener.channel, channel);
                client.Messages.set(listener.message, message);
            }
        }

        registerCommands(client);
    }   
}
```

W przypadku eventu jest ograniczona liczba nazw, którą możemy użyć, wszystkie są zawarte w docsach [`ClientEvents`](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-applicationCommandCreate)

Argumentami funkcji `run` jest `Bot` i reszta argumentów przesłanych przez event (mogą się różnić z eventu na event więc trzeba spojrzeć zawsze na docsy), dlatego każdy argument należy ręcznie opisać i pamiętać, że ważna jest tutaj kolejność.