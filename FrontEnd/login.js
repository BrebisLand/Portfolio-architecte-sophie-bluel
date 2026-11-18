const form = document.querySelector(".login-form");
form.addEventListener("submit", async function (event) {
    //Executer la fonction sans rehcarger la page
    event.preventDefault();
    //je sélectionne la classe login-error et je vide son contenu (je fais ça pour enlever "Accès refusé" lors d'une autre tentative de connexion)
    const loginError = document.querySelector(".login-error")
    loginError.textContent = "";
    //Je selectionne l'id email
    const email = document.querySelector("#email");
    //je récupére ce que vaut email (l'adresse mail rentré dans le champ email)
    const emailValue = email.value;

    const password = document.querySelector("#password");
    const passwordValue = password.value;

    //je créer une variable avec un objet
    const identifiants = {
        email: emailValue,
        password: passwordValue
    }

    //je transforme l'objet contenu dans la variable identifiants au format JSON
    const identifiantsJSON = JSON.stringify(identifiants);

    //J'envoi l'email et le password au serveur avec fetch() et la method POST, mais il faut encore attendre la réponse du serveur et l'analysé.
   const response = await fetch("http://localhost:5678/api/users/login", {
        //J'envoie des données au serveur
        method: "POST",
        //Je précise au serveur que les données envoyé sont au format JSON
        headers: {
            "Content-Type": "application/json"
        },
        //Le contenu de l'envoie avec les values de email et password contenu dans la variable identifiantsJSON
        body: identifiantsJSON
    })
    
    //J'utilise response.ok avec if pour savoir si la booleen renvoie true or false
    if (response.ok) {
        //Si response.ok vaut true alors :
        //j'attend que la réponse soit lu et convertit avant de me la renvoyer car response.json() est asynchrone
        const donnees = await response.json();
        //Je récupére le token contenu dans les informations reçus dans la variable donnees.
        const token = donnees.token;
        //Je stock le token dans la session avec sessionStorage pour que le token soit supprimé a la fermeture de l'onglet
        //Contrairement a window.localStorage qui lui stockerai le token, mais ne le supprimerai pas a la fermeture de l'onglet
        sessionStorage.setItem("token", token);
        //Une fois l'accés autorisé et le token stocké je peut redirigé l'utilisateur a la page index.html
        window.location.href = "./index.html";
    }
    else {
        loginError.textContent = "Accès refusé"
    }
})