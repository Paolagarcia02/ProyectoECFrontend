# 1. Usamos Node para instalar y arrancar Vite
FROM node:20

WORKDIR /app

# 2. Copiamos los archivos de instalación
COPY package*.json ./
RUN npm install

# 3. Copiamos todo el código de Vue
COPY . .

# 4. Exponemos el puerto de Vite
EXPOSE 5173

# 5. IMPORTANTE: Arrancamos con --host para que Docker permita ver la web desde fuera
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]