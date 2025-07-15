import { Authorizer } from "casbin.js";

class CasbinAuthorizerService {
  private authorizer: Authorizer | null = null;
  private currentUser: string | null = null;

  initializeAutoMode(apiEndpoint: string): Authorizer {
    this.authorizer = new Authorizer("auto", {
      endpoint: apiEndpoint,
    });
    return this.authorizer;
  }

  initializeManualMode(): Authorizer {
    this.authorizer = new Authorizer("manual");
    return this.authorizer;
  }

  async setUser(username: string): Promise<void> {
    if (!this.authorizer) {
      throw new Error("Authorizer not initialized");
    }
    this.currentUser = username;
    await this.authorizer.setUser(username);
  }

  setPermissions(permissions: any): void {
    if (!this.authorizer) {
      throw new Error("Authorizer not initialized");
    }

    this.authorizer.setPermission(permissions);
  }

  async can(action: string, object: string): Promise<boolean> {
    if (!this.authorizer) {
      return false;
    }

    try {
      const result = await this.authorizer.can(action, object);
      return result;
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }

  async cannot(action: string, object: string): Promise<boolean> {
    if (!this.authorizer) {
      return true;
    }

    try {
      const result = await this.authorizer.cannot(action, object);
      return result;
    } catch (error) {
      console.error("Error checking negative permission:", error);
      return true;
    }
  }

  getCurrentUser(): string | null {
    return this.currentUser;
  }

  getAuthorizer(): Authorizer | null {
    return this.authorizer;
  }

  clear(): void {
    this.currentUser = null;
    if (this.authorizer) {
      this.authorizer = new Authorizer("manual");
    }
  }
}
export const casbinAuthorizerService = new CasbinAuthorizerService();
