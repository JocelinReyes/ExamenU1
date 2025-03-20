const productList = document.getElementById("product-list");
        const editForm = document.getElementById("edit-form");
        const searchInput = document.getElementById("search");

        // Función para cargar productos desde la API
        async function loadProducts(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Error al cargar los productos");
                
                const productos = await response.json();
                productList.innerHTML = ""; // Limpiar la lista

                productos.forEach(producto => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("card");
                    productCard.innerHTML = `
                        <h3 class="card-title">${producto.name}</h3>
                        <p class="card-stock">Stock: ${producto.stock} pz</p>
                        <div>
                            <button class="card-button card-button_edit" data-id="${producto._id}">
                                <i class="bi bi-pen"></i>
                            </button>
                            <span class="card-precio">$${producto.price.toFixed(2)}</span>
                        </div>
                    `;

                    // Agregar evento para seleccionar el producto a editar
                    productCard.querySelector(".card-button_edit").addEventListener("click", () => {
                        loadProductForEdit(producto._id);
                    });

                    productList.appendChild(productCard);
                });
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        }

        // Función para cargar los datos de un producto en el formulario de edición
        async function loadProductForEdit(productId) {
            try {
                const response = await fetch(`http://localhost:3000/${productId}`);
                if (!response.ok) throw new Error("Error al obtener el producto");

                const producto = await response.json();
                
                // Llenar el formulario con los datos del producto
                document.getElementById("product-id").value = producto._id;
                document.getElementById("name").value = producto.name;
                document.getElementById("precio").value = producto.price;
                document.getElementById("stock").value = producto.stock;
            } catch (error) {
                console.error("Error al cargar el producto:", error);
            }
        }

        // Evento para guardar los cambios al editar un producto
        editForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const productId = document.getElementById("product-id").value;
            if (!productId) {
                alert("No hay producto seleccionado para editar");
                return;
            }

            const updatedProduct = {
                name: document.getElementById("name").value,
                price: parseFloat(document.getElementById("precio").value),
                stock: parseInt(document.getElementById("stock").value)
            };

            try {
                const response = await fetch(`http://localhost:3000/${productId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedProduct)
                });

                if (!response.ok) throw new Error("Error al actualizar el producto");

                alert("Producto actualizado con éxito");
                loadProducts(`http://localhost:3000/`); // Recargar la lista de productos
                editForm.reset(); // Limpiar el formulario
            } catch (error) {
                console.error("Error al actualizar el producto:", error);
            }
        });

        // Función para realizar la búsqueda de productos
        async function searchProducts() {
            const query = searchInput.value.trim();
            const url = query === "" 
                ? "http://localhost:3000/" 
                : `http://localhost:3000/search?name=${query}`;
            loadProducts(url); // Cargar productos con el filtro de búsqueda
        }

        // Evento para buscar productos mientras escribes
        searchInput.addEventListener("input", searchProducts);

        // Cargar los productos al iniciar la página
        document.addEventListener("DOMContentLoaded", () => {
            loadProducts("http://localhost:3000/"); // Cargar todos los productos
        });