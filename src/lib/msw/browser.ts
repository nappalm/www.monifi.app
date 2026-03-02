/* eslint-disable consistent-return */
import { setupWorker } from "msw/browser";
import browserHandlers from "./browserHandlers";

/**
 * Configuración del Service Worker de MSW para el navegador
 * Se usa en desarrollo para interceptar peticiones HTTP
 */
export const worker = setupWorker(...browserHandlers);

/**
 * Habilita el mocking de peticiones HTTP en desarrollo
 * Solo se ejecuta en modo desarrollo (no en producción)
 * @returns {Promise<ServiceWorkerRegistration | undefined>}
 */
export async function enableMocking() {
  // No habilitar MSW en producción
  if (import.meta.env.PROD) return;

  // Iniciar el service worker
  return worker.start({
    // Configuración de advertencias para peticiones no manejadas
    onUnhandledRequest(req, print) {
      // Ignorar peticiones a recursos estáticos
      const ignoredPaths = [
        "/assets/",
        "/public/",
        ".png",
        ".jpg",
        ".svg",
        ".ico",
      ];
      const shouldIgnore = ignoredPaths.some((path) => req.url.includes(path));

      if (!shouldIgnore) {
        print.warning();
      }
    },
    // Configuración adicional
    serviceWorker: {
      // Ruta al service worker (debe coincidir con la config en package.json)
      url: "/mockServiceWorker.js",
    },
    // Solo mostrar mensajes de inicio en modo verbose
    quiet: false,
  });
}
