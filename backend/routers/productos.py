from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.producto_schema import Producto, ProductoCreate
from models.producto import Producto as ProductoModel
from database import SessionLocal

router = APIRouter(prefix="/productos", tags=["Productos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[Producto])
def listar(db: Session = Depends(get_db)):
    return db.query(ProductoModel).all()

@router.post("/", response_model=Producto)
def crear(producto: ProductoCreate, db: Session = Depends(get_db)):
    nuevo = ProductoModel(**producto.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    p = db.query(ProductoModel).get(id)
    db.delete(p)
    db.commit()
    return {"ok": True}
