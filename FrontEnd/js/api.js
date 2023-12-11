
  export class YourApiClass {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
      this.listeProjets = [];
    }
  
    async getWorksApi() {
      try {
        const response = await fetch(this.baseUrl + "/works");
  
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut : ${response.status}`);
        }
  
        const data = await response.json();
  
        this.listeProjets.length = 0;
        this.listeProjets.push(...data);
  
        //console.log(this.listProjets);
  
        return this.listeProjets;
      } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
        throw error;
      }
    }
  
    async fetchData(route) {
      try {
        const response = await fetch(this.baseUrl + route);
  
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut : ${response.status}`);
        }
  
        const data = await response.json();
  
        console.log(data);
  
        return data;
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error);
        throw error;
      }
    }
    
    async loginUser(email, password) {
        try {
          const user = {
            email: email,
            password: password,
          };
    
          const chargeUtile = JSON.stringify(user);
    
          const response = await fetch(this.baseUrl + "/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: chargeUtile,
          });
    
          if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
          }
    
          const data = await response.json();
          const token = data.token;
          const userId = data.userId;
    
          localStorage.setItem("token", token);
    
          return {
            success: true,
            userId: userId,
          };
        } catch (error) {
            errorMessage();
        }

    
  }
}