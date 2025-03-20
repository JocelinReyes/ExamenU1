document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".formulario").addEventListener("submit", async function(event) {
        event.preventDefault(); // Evita que la página se recargue
        
        // Obtener los valores del formulario
        const nombre = document.getElementById("nombre").value;
        const precio = document.getElementById("precio").value;
        const stock = document.getElementById("stock").value;

        // Construir el objeto del producto
        const nuevoProducto = {
            name: nombre,
            price: parseFloat(precio),
            stock: parseInt(stock)
        };

        try {
            const response = await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto)
            });

            if (!response.ok) {
                throw new Error("Error al agregar producto");
            }

            const data = await response.json();
            alert("Producto agregado con éxito: " + data.name);

            // Limpiar formulario
            this.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo agregar el producto");
        }
    });
});
