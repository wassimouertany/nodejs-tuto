# Guide de Gestion d'Erreurs Centralisée

## Vue d'ensemble

Ce projet utilise un système de gestion d'erreurs centralisé qui garantit un format cohérent pour toutes les réponses d'erreur de l'API.

## Format Standard des Erreurs

Toutes les erreurs suivent le schéma défini dans `Standard_Error_Response_Schema.json` :

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Message descriptif",
    "status": 400,
    "details": [
      {
        "field": "nom_du_champ",
        "issue": "Description du problème"
      }
    ],
    "timestamp": "2025-09-26T08:45:44.123Z",
    "path": "/api/resource"
  }
}
```

## Classes d'Erreur Disponibles

### 1. AppError (Classe de base)
Erreur générique pour créer des erreurs personnalisées.

```javascript
import { AppError } from "../middlewares/errorHandler.js";

throw new AppError("CUSTOM_CODE", "Message personnalisé", 500, [
  { field: "field", issue: "Description" }
]);
```

### 2. ValidationError
Pour les erreurs de validation (400).

```javascript
import { ValidationError } from "../middlewares/errorHandler.js";

throw new ValidationError("Validation failed", [
  { field: "email", issue: "Invalid email format" }
]);
```

### 3. NotFoundError
Pour les ressources non trouvées (404).

```javascript
import { NotFoundError } from "../middlewares/errorHandler.js";

throw new NotFoundError("Task", [
  { field: "id", issue: "Task with id 123 does not exist" }
]);
```

### 4. UnauthorizedError
Pour les problèmes d'authentification (401).

```javascript
import { UnauthorizedError } from "../middlewares/errorHandler.js";

throw new UnauthorizedError("Invalid token", [
  { field: "token", issue: "Token has expired" }
]);
```

### 5. ForbiddenError
Pour les problèmes d'autorisation (403).

```javascript
import { ForbiddenError } from "../middlewares/errorHandler.js";

throw new ForbiddenError("Access denied", [
  { field: "role", issue: "Insufficient permissions" }
]);
```

### 6. ConflictError
Pour les conflits de données (409).

```javascript
import { ConflictError } from "../middlewares/errorHandler.js";

throw new ConflictError("User already exists", [
  { field: "email", issue: "This email is already registered" }
]);
```

## Utilisation dans les Controllers

### Pattern Recommandé

```javascript
import { NotFoundError, ValidationError } from "../middlewares/errorHandler.js";

export const getResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id);
    
    if (!resource) {
      throw new NotFoundError("Resource", [
        { field: "id", issue: `Resource with id ${id} not found` }
      ]);
    }
    
    res.json({ model: resource, message: "success" });
  } catch (error) {
    // Le middleware errorHandler s'occupe du reste
    next(error);
  }
};
```

### Ne PAS faire

❌ **Éviter les réponses d'erreur manuelles :**
```javascript
// MAUVAIS
res.status(404).json({ message: "Not found" });

// BON
throw new NotFoundError("Resource");
```

## Gestion Automatique des Erreurs

Le middleware `errorHandler` gère automatiquement :

1. **Erreurs MongoDB** :
   - `CastError` → Converti en `ValidationError`
   - `ValidationError` → Formaté avec les détails des champs
   - Erreur 11000 (duplication) → Converti en `ConflictError`

2. **Erreurs JWT** :
   - `JsonWebTokenError` → Converti en `UnauthorizedError`
   - `TokenExpiredError` → Converti en `UnauthorizedError`

3. **Erreurs génériques** :
   - Converties en `AppError` avec code `INTERNAL_SERVER_ERROR`

## Exemples Pratiques

### Création avec validation
```javascript
export const createTask = async (req, res, next) => {
  try {
    const task = new Task(req.body);
    await task.save(); // Les erreurs de validation Mongoose sont automatiquement gérées
    res.status(201).json({ model: task, message: "success" });
  } catch (error) {
    next(error);
  }
};
```

### Vérification d'existence
```javascript
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      throw new NotFoundError("Task", [
        { field: "id", issue: `Task ${req.params.id} does not exist` }
      ]);
    }
    
    res.json({ model: task, message: "success" });
  } catch (error) {
    next(error);
  }
};
```

### Authentification
```javascript
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      throw new UnauthorizedError("Invalid credentials", [
        { field: "email", issue: "Email or password is incorrect" }
      ]);
    }
    
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials", [
        { field: "password", issue: "Email or password is incorrect" }
      ]);
    }
    
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "24h" });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
```

## Structure du Middleware

Le middleware est configuré dans `app.js` dans cet ordre :

```javascript
// 1. Routes de l'API
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

// 2. Swagger docs
app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

// 3. Gestion des routes non trouvées (404)
app.use(notFoundHandler);

// 4. Gestion globale des erreurs (doit être le dernier)
app.use(errorHandler);
```

## Logs en Développement

En mode développement, les erreurs sont automatiquement loggées dans la console avec :
- Le format d'erreur complet
- La stack trace

Pour activer le mode production :
```bash
NODE_ENV=production node server.js
```

## Bonnes Pratiques

1. ✅ Toujours utiliser `next(error)` au lieu de gérer les erreurs manuellement
2. ✅ Utiliser les classes d'erreur appropriées selon le contexte
3. ✅ Fournir des détails précis dans le paramètre `details`
4. ✅ Inclure les informations sur les champs concernés
5. ✅ Tester différents scénarios d'erreur
6. ❌ Ne jamais envoyer de réponse d'erreur manuelle avec `res.status().json()`
7. ❌ Ne jamais oublier le paramètre `next` dans les controllers

## Tests

Pour tester le système d'erreur :

```bash
# Erreur 404 - Route non trouvée
curl http://localhost:3000/api/invalid-route

# Erreur 404 - Ressource non trouvée
curl http://localhost:3000/api/tasks/invalid-id

# Erreur 400 - Validation
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Erreur 409 - Conflit
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "existing@email.com", "password": "test"}'
```

## Avantages

- ✅ Format d'erreur cohérent dans toute l'API
- ✅ Code plus propre et maintenable
- ✅ Gestion centralisée des erreurs MongoDB et JWT
- ✅ Logs automatiques en développement
- ✅ Respect du schéma standard d'erreur
- ✅ Facilite les tests et le debugging
