# ── Build stage ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY CvSite.Api/CvSite.Api.csproj CvSite.Api/
RUN dotnet restore CvSite.Api/CvSite.Api.csproj
COPY CvSite.Api/ CvSite.Api/
RUN dotnet publish CvSite.Api/CvSite.Api.csproj -c Release -o /app/publish

# ── Runtime stage ────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish ./
EXPOSE 8080
ENTRYPOINT ["dotnet", "CvSite.Api.dll"]
