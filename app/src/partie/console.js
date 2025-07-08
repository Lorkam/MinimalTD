

export class Console {
    constructor(partie) {
        this.partie = partie;
        this.divConsole = document.querySelector('#divConsole');
        this.divHistorique = document.querySelector('#divHistorique');
        this.input = document.querySelector('#inputBarreEcriture');
        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const message = this.input.value.trim();
                if (message) {
                    this.input.value = ''; // Vide la barre d'écriture après l'envoi
                    this.analyserMessage(message);
                }
            }
        });
    }

    ecrire(message) {
        const p = document.createElement('p');
        p.textContent = message;
        this.divHistorique.appendChild(p);
        this.divHistorique.scrollTop = this.divHistorique.scrollHeight;
    }

    afficherConsole() {
        this.divConsole.style.display = 'flex'; // Affiche la console
    }

    masquerConsole() {
        this.divConsole.style.display = 'none'; // Masque la console
    }

    analyserMessage(message) {
        console.log(message);
        // Analyse le message et exécute les commandes qui correspondent
        const listeMots = message.trim().toLowerCase().split(' '); // Sépare les mots de la commande
        console.log(listeMots);
        if (listeMots[0].startsWith('/')) {
            listeMots[0] = listeMots[0].slice(1).trim();
            switch (listeMots[0]) {
                case 'aide':
                    this.ecrire('Commandes disponibles : /aide, /give, /vie');
                    break;
                case 'give':
                    this.partie.golds += parseInt(listeMots[1], 10);
                    break;
                case 'vie':
                    this.ecrire(`Vie restante : ${this.partie.vie}`);
                    break;
                default:
                    this.ecrire(`Commande inconnue : ${commande}`);
            }
        } else {
            this.ecrire(`Message non reconnu : ${message}`);
        }
    }
}