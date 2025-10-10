# Project Documentation - Team Collaboration

## Team Structure & Responsibilities

**Sub-Group Project Lead**: Nehikhare Efehi
- Genres collection (8+ fields) ✅ COMPLETED
- MongoDB Atlas setup and database management
- Project coordination and integration

**Team Members**:
- **Songopa**: Authentication & User management + Albums collection
- **Guillermo**: Labels & Reviews collections  
- **Letlotlo**: Testing framework (16+ tests) + Artists collection

## Database Information

**Database Name**: `musicpro`
**Platform**: MongoDB Atlas
**Access**: Individual credentials provided to team members

## Development Workflow

### Git Branches
```bash
# Create feature branches for each team member
git checkout -b feature/nehikhare-genres     # ✅ COMPLETED
git checkout -b feature/songopa-auth
git checkout -b feature/guillermo-data
git checkout -b feature/letlotlo-testing
```

### Integration Testing
- Test individual collections independently
- Test cross-collection relationships
- Validate authentication on protected routes
- Ensure comprehensive test coverage (16+ tests)

## Genre Collection (COMPLETED)

**Model**: 8 fields exceeding 7+ requirement
- name, description, originDecade, parentGenre
- characteristics[], popularArtists[], subgenres[], popularityScore

**API Endpoints**: Full CRUD with Swagger documentation
- GET `/api/genres` - List with filtering & pagination
- GET `/api/genres/:id` - Single genre
- POST `/api/genres` - Create (auth required)
- PUT `/api/genres/:id` - Update (auth required)
- DELETE `/api/genres/:id` - Delete (auth required)

**Status**: ✅ Model, Controller, Routes complete and tested

## Project Timeline

- **Development Phase**: Individual collection implementation
- **Integration Phase**: Cross-collection testing and authentication
- **Submission**: Weekend deadline - comprehensive API with documentation