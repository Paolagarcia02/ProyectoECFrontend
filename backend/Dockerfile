# 1. Imagen para compilar el código (SDK de .NET)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 2. Copiamos el archivo de proyecto y restauramos dependencias
COPY *.csproj ./
RUN dotnet restore

# 3. Copiamos el resto del código y publicamos la app
COPY . .
RUN dotnet publish "BackEnd.csproj" -c Release -o /app/publish

# 4. Imagen ligera para ejecutar la app (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Exponemos el puerto interno del contenedor
EXPOSE 8080

# Comando para arrancar la API
ENTRYPOINT ["dotnet", "BackEnd.dll"]