
export class Sauvegarde {
    constructor(nom) {
        this.nom = nom;
        this.emplacementSave = `../serv/saves.json`;
        this.save = null; // Initialisation de la sauvegarde
    }
    /**
    * Récupère de façon asynchrone les données de sauvegarde du serveur pour l'utilisateur courant.
    *
    * Envoie une requête POST au backend PHP pour obtenir la liste des sauvegardes associées au nom de l'utilisateur.
    *
    * @async
    * @returns {Promise<Object>} Une promesse qui se résout avec la réponse JSON contenant les données sauvegardées.
    * @throws {Error} Affiche une erreur dans la console si l'opération fetch échoue.
    */
    async lireSaves() {
           const url = '../serv/gestionSaves.php'; // Les valeurs sont des options du select sont les uri

           try {
              // création de la requete pour accéder au php
              const response = await fetch(url, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                 body: 'action=lireSaves'+ '&nom=' + encodeURIComponent(this.nom)
              });
              const rep = await response.json();
              //console.log(rep.saves);
              return rep;
           } catch (error) {
              console.error('Erreur récupération données :', error);
           }
    }    
}

/**
 * Récupère tous les noms de sauvegardes disponibles depuis le serveur.
 *
 * Envoie une requête POST à un script PHP pour obtenir la liste des sauvegardes,
 * puis retourne un tableau contenant les noms des sauvegardes.
 *
 * @async
 * @function
 * @returns {Promise<string[]|undefined>} Un tableau de noms de sauvegardes si la requête réussit, sinon undefined en cas d'erreur.
 */
export async function recupAllNomSaves() {
    const url = '../serv/gestionSaves.php';
    try {
        // création de la requete pour accéder au php
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=lireSaves'
        });

        const data = await response.json();
        //console.log(data);
        return Object.keys(data.saves);
    } catch (error) {
        console.error('Erreur récupération données :', error);
    }
}

export async function selectionnerSauvegarde(nomSauvegarde) {
    const url = '../serv/gestionSaves.php';
    try {
        // création de la requete pour accéder au php
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=selectionnerSauvegarde' + '&nom=' + encodeURIComponent(nomSauvegarde)
        });
        return await response.text();
    } catch (error) {
        console.error('Erreur récupération données :', error);
    }
}

export async function creerSauvegarde(nomSauvegarde) {
    const url = '../serv/gestionSaves.php';
    try {
        // création de la requete pour accéder au php
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=creerSauvegarde' + '&nom=' + encodeURIComponent(nomSauvegarde)
        });
        const data = await response.text()
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Erreur récupération données :', error);
    }
}