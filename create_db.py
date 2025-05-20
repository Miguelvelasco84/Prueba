from database import Base, engine
from models.producto import Producto

Base.metadata.create_all(bind=engine)
print("Base de datos creada.")
