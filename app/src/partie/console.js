

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
        // Analyse le message et exécute les commandes qui correspondent
        const listeMots = message.trim().toLowerCase().split(' '); // Sépare les mots de la commande
        if (listeMots[0].startsWith('/')) {
            listeMots[0] = listeMots[0].slice(1).trim();
            switch (listeMots[0]) {
                case 'aide':
                    this.ecrire('Commandes disponibles : /aide, /give, /malphite');
                    break;
                case 'give': // cheat
                    this.partie.golds += parseInt(listeMots[1], 10);
                    break;
                case 'malphite': // Easter Egg
                    this.ecrire(`Top Diff`);
                    this.partie.canvas.style.background = "url(../assets/img/KAYOU.jpg)";
                    this.partie.canvas.style.backgroundSize = "cover";
                    this.partie.canvas.style.backgroundPosition = "center";
                    this.partie.canvas.style.backgroundRepeat = "no-repeat";
                    break;
                default:
                    this.ecrire(`Commande inconnue : ${message}`);
            }
        } else {
            this.ecrire(message); // Affiche le message dans la console
        }
    }
}