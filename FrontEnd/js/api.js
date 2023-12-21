export class YourApiClass {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.listeProjets = [];
    this.listeCategories = [];
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

   

      return this.listeProjets;
    } catch (error) {
      throw error;
    }
  }

  async getCategoriesApi() {
    try {
      const response = await fetch(this.baseUrl + "/categories");

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      const data = await response.json();

      this.listeCategories.length = 0;
      this.listeCategories.push(...data);


      return this.listeCategories;
    } catch (error) {
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


      return data;
    } catch (error) {
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

async deleteWorksApi(idToDelete) {
  try {
    if (!idToDelete) {
      return false;
    }

    const response = await fetch(`${this.baseUrl}/works/${idToDelete}`, {
      method: "DELETE",
      headers: {
        "Accept": "*/*",
        "Authorization": "Bearer " + localStorage.token,
      },
    });

    if (response.ok) {
      return true;
    } else if (response.status === 401) {
      alert('Session expirée, merci de vous reconnecter');
      document.location.href = "login.html"; 
    }
  } catch (error) {
    throw error;
  }
}

async uploadFormDataToAPI(formData) {
  try {
    const response = await fetch(this.baseUrl + "/works", {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.token,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur HTTP! Statut : ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Une erreur s'est produite lors de l'appel à l'API :", error);
  }
}

}





