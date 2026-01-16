const data = {
    sistemas: [
        [{id:"mat1",nombre:"Matemática I",uv:4},{id:"algebra",nombre:"Álgebra de Vectores",uv:4},{id:"introIng",nombre:"Intro a la Ingeniería",uv:3},{id:"principiosComp",nombre:"Principios de Computación",uv:4},{id:"dibujo",nombre:"Dibujo y Geometría",uv:3}],
        [{id:"mat2",nombre:"Matemática II",uv:4,req:["mat1"]},{id:"fisica1",nombre:"Física I",uv:4,req:["mat1","algebra"]},{id:"sociologia",nombre:"Sociología General",uv:3},{id:"prog1",nombre:"Programación I",uv:4,req:["principiosComp"]},{id:"psicologia",nombre:"Psicología Empresarial",uv:3}],
        [{id:"mat3",nombre:"Matemática III",uv:4,req:["mat2"]},{id:"fisica2",nombre:"Física II",uv:4,req:["fisica1"]},{id:"estatica",nombre:"Estática",uv:4,req:["mat2","fisica1"]},{id:"prog2",nombre:"Programación II",uv:4,req:["prog1"]},{id:"ingles",nombre:"Inglés",uv:3}],
        [{id:"mat4",nombre:"Matemática IV",uv:4,req:["mat3"]},{id:"fisica3",nombre:"Física III",uv:4,req:["fisica2"]},{id:"redes1",nombre:"Redes de Computadoras I",uv:4,req:["prog2"]},{id:"prog3",nombre:"Programación III",uv:4,req:["prog2"]},{id:"inglesTec",nombre:"Inglés Técnico",uv:3,req:["ingles"]}],
        [{id:"probEst",nombre:"Probabilidad y Estadística",uv:4,req:["mat2"]},{id:"sistElect",nombre:"Sist. Eléctricos Lineales I",uv:4,req:["mat4","fisica3"]},{id:"redes2",nombre:"Redes de Computadoras II",uv:4,req:["redes1"]},{id:"progWeb",nombre:"Programación Web",uv:4,req:["prog1"]},{id:"bd1",nombre:"Base de Datos I",uv:4,req:["prog3"]}],
        [{id:"invOp",nombre:"Investigación Operaciones",uv:4,req:["mat3"]},{id:"electronica",nombre:"Electrónica",uv:4,req:["sistElect"]},{id:"legislacion",nombre:"Legislación Empresarial",uv:3,uvreq:60},{id:"desSoft1",nombre:"Desarrollo Software I",uv:4,req:["redes2","progWeb"]},{id:"bd2",nombre:"Base de Datos II",uv:4,req:["bd1"]}],
        [{id:"ingEco",nombre:"Ingeniería Económica",uv:3,uvreq:60},{id:"teoAdm",nombre:"Teoría Administrativa",uv:3,uvreq:80},{id:"analisisSis",nombre:"Análisis de Sistemas",uv:4,req:["desSoft1"]},{id:"desSoft2",nombre:"Desarrollo Software II",uv:4,req:["desSoft1","bd2"]},{id:"contabilidad",nombre:"Contabilidad",uv:3}],
        [{id:"moviles",nombre:"Desarrollo Móvil",uv:4,req:["desSoft2"]},{id:"arquitectura",nombre:"Arq. de Computadoras",uv:4,req:["analisisSis"]},{id:"implantacion",nombre:"Implantación de Sistemas",uv:4,req:["analisisSis","desSoft2"]},{id:"seguridad",nombre:"Seguridad Informática",uv:4,req:["desSoft2"]},{id:"metodosInv",nombre:"Métodos de Investigación",uv:3,req:["probEst"]}],
        [{id:"ingSoft",nombre:"Ingeniería del Software",uv:4,req:["implantacion"]},{id:"bajoNivel",nombre:"Prog. de Bajo Nivel",uv:4,req:["prog3","arquitectura"]},{id:"orgMet",nombre:"Organización y Métodos",uv:3,req:["legislacion"]},{id:"emprende",nombre:"Emprendedurismo",uv:3,uvreq:100},{id:"auditoria",nombre:"Auditoría de Sistemas",uv:4,req:["implantacion"]}],
        [{id:"formEval",nombre:"Formulación y Evaluación",uv:4,uvreq:150},{id:"sistOp",nombre:"Sistemas Operativos",uv:4,req:["bajoNivel"]},{id:"compiladores",nombre:"Compiladores",uv:4,req:["bajoNivel"]},{id:"etica",nombre:"Ética Profesional",uv:3,req:["psicologia"]},{id:"desSoft3",nombre:"Desarrollo Software III",uv:4,req:["ingSoft"]}],
        [{id:"redayorto",nombre:"Redacción y Ortografía",uv:3},{id:"semgrad",nombre:"Seminario de Graduación",uv:3}]
    ],
    industrial: [ /* Se repite estructura similar con sus IDs propios */ ]
};

function getProgreso(carrera) { return JSON.parse(localStorage.getItem(`progreso_${carrera}`)) || []; }

function marcar(id, bloqueadaPorCiclo) {
    if (bloqueadaPorCiclo) {
        alert("Esta materia no se oferta en el periodo actual.");
        return;
    }
    const carrera = document.getElementById("carrera").value;
    let progreso = getProgreso(carrera);
    const materia = data[carrera].flat().find(m => m.id === id);
    const uvCompletas = data[carrera].flat().filter(m => progreso.includes(m.id)).reduce((a,b)=>a+b.uv,0);

    if (materia.req && !materia.req.every(r => progreso.includes(r))) return alert("No cumples los prerrequisitos.");
    if (materia.uvreq && uvCompletas < materia.uvreq) return alert(`Requieres ${materia.uvreq} UV.`);

    progreso = progreso.includes(id) ? progreso.filter(m => m !== id) : [...progreso, id];
    localStorage.setItem(`progreso_${carrera}`, JSON.stringify(progreso));
    renderMalla();
}

function renderMalla() {
    const carrera = document.getElementById("carrera").value;
    const periodo = document.getElementById("periodoActual").value;
    const container = document.getElementById("mallaContainer");
    const progreso = getProgreso(carrera);

    let uvTotal = 0, uvProgreso = 0;
    container.innerHTML = "";

    data[carrera].forEach((ciclo, idx) => {
        const numCiclo = idx + 1;
        const col = document.createElement("div");
        col.className = "ciclo-col";
        col.innerHTML = `<div class="ciclo-titulo">Ciclo ${numCiclo}</div>`;

        // Lógica de ciclo par/impar
        const esCicloParMateria = numCiclo % 2 === 0;
        const ofertaCerrada = (periodo === "impar" && esCicloParMateria) || (periodo === "par" && !esCicloParMateria);

        ciclo.forEach(m => {
            uvTotal += m.uv;
            const completada = progreso.includes(m.id);
            if(completada) uvProgreso += m.uv;

            const div = document.createElement("div");
            const bloqueada = (m.req && !m.req.every(r => progreso.includes(r)));

            // Si ya está completada, no importa el ciclo actual
            const claseFinal = completada ? 'completada' : (ofertaCerrada ? 'no-ofertada' : (bloqueada ? 'bloqueada' : 'disponible'));

            div.className = `materia ${claseFinal}`;
            div.innerHTML = `
                <h4>${m.nombre}</h4>
                <span class="meta">UV: ${m.uv}</span>
                <span class="status-tag">${completada ? '✓ Lograda' : (ofertaCerrada ? '✘ No ofertada' : '○ Disponible')}</span>
            `;

            div.onclick = () => marcar(m.id, !completada && ofertaCerrada);
            col.appendChild(div);
        });
        container.appendChild(col);
    });

    document.getElementById("uvCount").innerText = `${uvProgreso} / ${uvTotal}`;
    document.getElementById("barraProgreso").style.width = (uvProgreso/uvTotal*100) + "%";
}

function reset() { localStorage.clear(); renderMalla(); }
document.addEventListener("DOMContentLoaded", renderMalla);