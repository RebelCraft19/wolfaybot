const Discord = require("discord.js");

const Client = new Discord.Client();

const fs = require("fs");

const bdd = require("./bdd.json");

const prefix = "/";

Client.on("ready", () => {
    console.log("Bot opérationnel");

    Client.guilds.cache.find(guild => guild.id === "770546901451276328").channels.cache.find(channel => channel.id === "771283972029546496").messages.fetch("774640088806064178").then(message => {
        console.log("message ajouté à la mémoire : " + message.content);
    }).catch(err => {
        console.log("impossible d'ajouter le message en mémoire : " + err);
    });
});

/*Client.on("messageReactionAdd", (reaction, user) => {

    if(user.bot) return;
    
    console.log("reaction ajoutee par " + user.username + "\nNom de l'emoji : " + reaction.emoji.name + " \nC'est la " + reaction.count + "e reaction");

    if(reaction.message.id === "774640088806064178"){
        if(reaction.emoji.name === "false"){
            var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
            member.roles.add("770548565956100136").then(mbr => {
                console.log("Roles attribué avec succès pour " + mbr.displayName);
            }).catch(err => {
                console.log("le role n'a pas pu être attribué" + err);
            });
        }
    }

    /*reaction.users.remove(user.id).then(react =>{
        console.log("reaction " + reaction.emoji.name + " retirée par le bot");
    }).catch(err => {
        console.log("impossible de retirer la reaction" + err);
    });*/

    /*reaction.remove().then(react => {
        console.log("reaction " + reaction.emoji.name + " retirée par le bot");
    }).catch(err => {
        console.log("impossible de retirer la reaction" + err);
    });

});*/

Client.on("messageReactionRemove", (reaction, user) => {
    console.log(user.bot);
    if(user.bot) return;

    console.log("reaction retiree");

    if(reaction.message.id === "774640088806064178"){
        if(reaction.emoji.name === "false"){
            var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
            member.roles.remove("770548565956100136").then(mbr => {
                console.log("Roles retiré avec succès pour " + mbr.displayName);
            }).catch(err => {
                console.log("le role n'a pas pu être retiré" + err);
            });
        }
    }
});

Client.on("message", message => {
    if(message.author.bot) return;

    if(message.channel.type == "dm") return;
    //!help
    if(message.content == prefix + "help") {

        var embed = new Discord.MessageEmbed()
            .setColor("#94fff5")
            .setTitle("Page d'aide")
            .setDescription("Voici la liste des commandes :")
            .addField("/help :", "Donne la liste des commandes")
            .addField("/ping :", "Vous permet d'estimer la vitesse du bot")
            .addField("/tempmute :", "Rend muet temporairement un utilisateur")
            .addField("/ban :", "Bannit un utilisateur du serveur")
            .addField("/kick : ", "Expulse un utilisateur du serveur")
            //.addField("/stats", " Vous donne votre ID")
            .setFooter("Bot by RebelCraft19")
        message.channel.send(embed)
    }


    //!ping
    if(message.content == prefix + "ping"){
        message.channel.send("Pong !");
    }
    //!stat
    if(message.content.startsWith(prefix + "info")){
        let mention = message.mentions.members.first();

        if(mention == undefined){
            message.reply("Veuillez mentionner un utilisateur.")
        }
        else {
            var embed = new Discord.MessageEmbed()
            .setColor("#f0bb49")
            .setTitle("Information sur l'utilisateur " + mention.displayName)
            .addField("ID :", mention.id)
            message.channel.send(embed)
        }
    }
    
    if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veuillez mentionner un utilisateur à bannir.");
            }
            else {
                if(mention.bannable){
                    mention.ban();
                    message.channel.send("Utilisateur " + mention.displayName + " banni avec succès !");
                }
                else {
                    message.reply("L'utilisateur ne peut pas être banni.");
                }
            }
        }
        else if(message.content.startsWith(prefix + "kick")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veuillez mentionner l'utilisateur à expulser.");
            }
            else {
                if(mention.kickable){
                    mention.kick();
                    message.channel.send("Utilisateur " + mention.displayName + " expulsé avec succès !");
                }
                else{
                    message.reply("L'utilisateur ne peut pas être expulsé.");
                }
            }
        }
        else if(message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veuillez mentionner l'utilisateur à rendre muet.");
            }
            else {
                mention.roles.add("771305558376054785");
                message.channel.send("Utilisateur " + mention.displayName + " rendu muet avec succès !")
            }
        }   
        else if(message.content.startsWith(prefix + "unmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veuillez mentionner l'utilisateur à unmute.");
            }
            else {
                mention.roles.remove("771305558376054785");
                message.channel.send("Utilisateur " + mention.displayName + " unmute avec succès !")
            }
        }   
        /*else if(message.content.startsWith(prefix + "tempmute")) {
            let mention = message.mentions.users.first();
            let muterole = message.guild.roles.cache.find(r=> r.name === "Muted");

            if (mention == undefined) {
                message.reply("Veuillez mentionner l'utilisateur à rendre muet temporairement.");
            } else {
                let args = message.content.slice(prefix.length).trim().split(/ +/g);

                let time;
                if (args[2].endsWith("s")) {
                    time = Number(args[2].replace(/s/g, "")) * 1000;
                } else if (args[2].endsWith("m")) {
                    time = Number(args[2].replace(/m/g, "")) * 60000;
                } else if (args[2].endsWith("h")) {
                    time = Number(args[2].replace(/h/g, "")) * 3600000;
                } else if (args[2].endsWith("d")) {
                    time = Number(args[2].replace(/d/g, "")) * 86400000;
                } else {
                return message.channel.send(":x: Le temps indiqué est invalide.");
                };
                mention.roles.add(muterole);
                var embed = new Discord.MessageEmbed()
                    .setColor("#fd2727")
                    .setDescription("Utilisateur " + mention.displayName + "rendu muet avec succès")
                message.channel.send(embed)
                console.log(args[2]);
                setTimeout(function() {
                    mention.roles.remove(muterole);
                    message.channel.send("Utilisateur " + "<@" + mention.id + ">" + " peut de nouveau parler.");
                    console.log("<@" + mention.displayName + ">" + "demute" );
                }, time);
            }
        }*/

        

    //!mb
    /*if(message.content.startsWith(prefix + "mb")){
        if(message.member.hasPermission("MANAGE_MESSAGES")){
            if(message.content.length > 5){
                message_bvn = message.content.slice(4)
                id_serv = message.guild.id
                bdd["message_bvn"] = message_bvn + " forserv: " + id_serv
                Savebdds()
            }
        }
    }*/

};

client.on("message", msg =>{
    msg.content.startsWith(prefix + "mute"); {
      var muteRole = msg.guild.roles.cache.find(role => role.name.toLowerCase().includes("Muted"));
      var muteUser = msg.mentions.members.first();
      var minutes = args[2];
      
  
      if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Pas la permission");
      if (!muteUser) return msg.channel.send("Pas de mention d'user");
      if (!muteRole) return msg.channel.send("Pas de rôle existant");
      if (!msg.guild.member(client.user.id).hasPermission("MANAGE_MESSAGES")) return msg.channel.send("J\ai pas la permission");
  
      var embedMute = new Discord.RichEmbed()
      .setTitle("Mute")
      .addField("Utilisateur mute :", muteUser)
      .addField("Mute par :", `${msg.author.tag}`)
      .setTimestamp();
  
      muteUser.addRole(muteRole);
      msg.channel.send(embedMute)
      
      timeout(minutes, muteUser, muteRole, message)
    }
  
    function timeout(minutes, muteUser, mutedRole, message) {
          setTimeout(() => {
          muteUser.roles.remove(mutedRole, `Temporary mute expired.`);
  
          var muteEmbed = new Discord.MessageEmbed()
          muteEmbed.setTitle("Unmute")
          muteEmbed.addField("Unmute utilisateur :", muteUser)
          muteEmbed.setFooter(`Unmuted by me`)
          muteEmbed.setTimestamp();
          message.channel.send(muteEmbed)
        }, minutes * 60000);
    }
});


function Savebdds() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue");
    });
}

Savebdds();

Client.login(process.env.TOKEN);