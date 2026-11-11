const gallery = document.querySelector(".gallery");
console.log(gallery);

async function getProjects() {
    //je récupère les projets a partir de l'api
    const reponse = await fetch("http://localhost:5678/api/works");
    //je convertit le résultat de la requête de l'api en json
    const projects = await reponse.json();
    for(let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = project.imageUrl
        img.alt = project.title
        const figcaption = document.createElement("figcaption");
        //.textContent sert a afficher du text provenant de l'api sans l'interpréter comme du HTML
        figcaption.textContent = project.title

        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    }
    
}
getProjects()