// Funcion de scroll active
document.addEventListener("DOMContentLoaded", function () {
  const scrollButton = document.querySelector(".scroll-to-top");

  // Mostrar u ocultar el botón según el scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollButton.style.opacity = "1";
      scrollButton.style.visibility = "visible";
    } else {
      scrollButton.style.opacity = "0";
      scrollButton.style.visibility = "hidden";
    }
  });

  // Agregar el desplazamiento suave al hacer clic
  scrollButton.addEventListener("click", function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Aplica el desplazamiento suave
    });
  });
});

// Función de Testimonios
document.addEventListener("DOMContentLoaded", function () {
  const testimonials = document.querySelectorAll(".testimonial");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const dots = document.querySelectorAll(".dot");

  let currentIndex = 0;
  let autoSlideInterval;

  function showTestimonial(index) {
    // Ocultar todos los testimonios
    testimonials.forEach((testimonial) =>
      testimonial.classList.remove("active")
    );
    dots.forEach((dot) => dot.classList.remove("active"));

    // Mostrar el testimonio actual
    testimonials[index].classList.add("active");
    dots[index].classList.add("active");
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function prevTestimonial() {
    currentIndex =
      (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextTestimonial, 5000); // Cambia cada 5 segundos
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  prevButton.addEventListener("click", function () {
    prevTestimonial();
    resetAutoSlide();
  });

  nextButton.addEventListener("click", function () {
    nextTestimonial();
    resetAutoSlide();
  });

  // Control de navegación con indicadores
  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      currentIndex = index;
      showTestimonial(currentIndex);
      resetAutoSlide();
    });
  });

  // Mostrar el primer testimonio al cargar la página
  showTestimonial(currentIndex);
  startAutoSlide();
});

// Validación de formulario

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const checkboxes = document.querySelectorAll(".product-checkbox");
  const totalElement = document.getElementById("total");

  function calcularTotal() {
    let total = 0;
    checkboxes.forEach((checkbox) => {
      const cantidadInput = checkbox.nextElementSibling;
      if (checkbox.checked && cantidadInput.value > 0) {
        total +=
          parseInt(checkbox.dataset.price) * parseInt(cantidadInput.value);
      }
    });
    totalElement.textContent = total.toLocaleString("es-CO");
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", calcularTotal);
    checkbox.nextElementSibling.addEventListener("input", calcularTotal);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    //      Obtener valores de los campos
    const nombre = document.getElementById("name");
    const celular = document.getElementById("phone");
    const direccion = document.getElementById("address");
    const ciudad = document.getElementById("city");
    const metodoPago = document.getElementById("payment-method");

    //      Expresiones regulares
    const nombreRegex = /^[A-Za-z\s]{10,}$/;
    const celularRegex = /^[0-9]{10}$/;
    const ciudadRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{4,}$/;

    let valid = true;

    //      Función para mostrar errores
    function mostrarError(input, mensaje) {
      let error = input.nextElementSibling;
      if (!error || !error.classList.contains("error-message")) {
        error = document.createElement("div");
        error.classList.add("error-message");
        input.parentNode.insertBefore(error, input.nextSibling);
      }
      error.textContent = mensaje;
      input.classList.add("error-input");
      valid = false;
    }

    //      Función para limpiar errores
    function limpiarError(input) {
      let error = input.nextElementSibling;
      if (error && error.classList.contains("error-message")) {
        error.remove();
      }
      input.classList.remove("error-input");
    }

    //      Validar nombre
    limpiarError(nombre);
    if (!nombreRegex.test(nombre.value.trim())) {
      mostrarError(
        nombre,
        "Debe tener al menos 10 caracteres y solo puede contener letras."
      );
    }

    //      Validar celular
    limpiarError(celular);
    if (!celularRegex.test(celular.value.trim())) {
      mostrarError(celular, "Debe tener exactamente 10 dígitos numéricos.");
    }

    //      Validar dirección
    limpiarError(direccion);
    if (direccion.value.trim().length < 5) {
      mostrarError(direccion, "Debe tener al menos 5 caracteres.");
    }

    //      Validar ciudad
    limpiarError(ciudad);
    if (!ciudadRegex.test(ciudad.value.trim())) {
      mostrarError(
        ciudad,
        "Debe tener al menos 4 letras y no puede contener números ni caracteres especiales."
      );
    }

    //      Si hay errores, detener el envío del formulario
    if (!valid) return;

    let productosSeleccionados = "";
    let totalCompra = 0;
    checkboxes.forEach((checkbox) => {
      const cantidad = checkbox.nextElementSibling.value;
      if (checkbox.checked && cantidad > 0) {
        productosSeleccionados += `🔹 ${
          checkbox.dataset.name
        } (x${cantidad}) - $${(
          checkbox.dataset.price * cantidad
        ).toLocaleString("es-CO")}\n`;
        totalCompra += parseInt(checkbox.dataset.price) * parseInt(cantidad);
      }
    });

    //      Si no se seleccionó ningún producto, mostrar pop-up
    if (!productosSeleccionados) {
      mostrarPopup(
        "Debes seleccionar al menos un producto antes de continuar."
      );
      return;
    }

    enviarAWhatsApp(
      nombre.value.trim(),
      celular.value.trim(),
      direccion.value.trim(),
      ciudad.value.trim(),
      metodoPago.value,
      productosSeleccionados,
      totalCompra
    );
  });

  function enviarAWhatsApp(
    nombre,
    celular,
    direccion,
    ciudad,
    metodoPago,
    productos,
    total
  ) {
    const numeroWhatsApp = "573045354056";
    const mensaje = `📦 *Nuevo Pedido KARIDESMU*\n\n👤 *Nombre:* ${nombre}\n📞 *Celular:* ${celular}\n📍 *Dirección:* ${direccion}\n🏙️ *Ciudad:* ${ciudad}\n\n💳 *Método de pago:* ${metodoPago}\n\n🛍️ *Productos seleccionados:*\n${productos}\n💰 *Total a pagar:* $${total.toLocaleString(
      "es-CO"
    )}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.location.replace(url); //Abre WhatsApp en otra pestaña
    setTimeout(() => {
      window.location.href = "gracias.html";
    }, 3000);
  }
});

function mostrarPopup(mensaje) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
       <div class="popup-content">
         <p>${mensaje}</p>
         <button id="close-popup">Cerrar</button>
       </div>
     `;
  document.body.appendChild(popup);

  document.getElementById("close-popup").addEventListener("click", () => {
    popup.remove();
  });
}
