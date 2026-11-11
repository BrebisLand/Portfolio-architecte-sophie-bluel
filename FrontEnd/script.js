const gallery = document.querySelector(".gallery");
//je créer une variable projects pour pouvoir l'utiliser dans mes fonctions
let projects;

//Je créer la fonction init pour éviter que les boutons de filtres soit créer avant que le tableau projects soit disponible
async function init() {
    //j'exécute la fonction getProjects et j'attend qu'elle soit terminé
    await getProjects();
    //Ensuite j'exécute la fonction getCategories et j'attend qu'elle soit terminé
    await getCategories();
}
init();

async function getProjects() {
    //je récupère les projets a partir de l'api
    const reponse = await fetch("http://localhost:5678/api/works");
    //je convertit le résultat de la requête de l'api en json
    projects = await reponse.json();
    //je fais appel a ma fonction displayProject pour afficher les projets de mon tableau contenu dans la variable projects
    displayProjects(projects);
}

const filters = document.querySelector(".filters");
async function getCategories () {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    //création du bouton "Tous"
    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    filters.appendChild(buttonAll);
    buttonAll.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML ="";
    displayProjects(projects);
    })

    for(let i = 0; i < categories.length; i++) {
        const category = categories[i];

        const button = document.createElement("button");
        button.textContent = category.name

        filters.appendChild(button);
        //J'ajoute un EventListener pour "écouter" chaque click sur les boutons
        button.addEventListener("click", function () {
            //je re créer un tableau avec .filter a partir de mon tableau projects de base, avec uniquement les projets qui respecte la condition ci dessous
            const filteredProjects = projects.filter(function (project) {
                //Je vérifie si la categoryId du projet appartient a la catégorie du bouton séléctionné
                return project.categoryId === category.id;
            })
            //au click je supprime aussi les éléments contenue dans le HTML sous la class .gallery
            document.querySelector(".gallery").innerHTML ="";
            //ensuite je fais appel a la fonction displayProjects pour afficher les projets contenu dans mon nouveau tableau créer avec la variable filteredProjects
            displayProjects(filteredProjects);
        })
    }

}

function displayProjects(projectList) {
    for(let i = 0; i < projectList.length; i++) {
        const project = projectList[i];
        //je créer mes balise avec .createElement
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = project.imageUrl
        img.alt = project.title
        const figcaption = document.createElement("figcaption");
        //.textContent sert a afficher du text provenant de l'api sans l'interpréter comme du HTML
        figcaption.textContent = project.title
        //j'assigne mes éléments dans le DOM avec .appendChild
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    }
}