from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy import false
from sqlalchemy.orm import Session
from typing import List
from .. import models, database, oauth2, schemas, utils

from random_address import real_random_address
import names
import random


router = APIRouter(prefix='/users', tags=['Users'])

@router.post('/email')
def get_data_via_email(request: schemas.UserEmail, db: Session=Depends(database.get_db)):
    user_email = db.query(models.User).filter(models.User.email == request.email).first()
    if user_email is None: 
        return {'msg': 'No account with this email exists!'}
    if not user_email.zelle_registered:
        return {'msg': 'Not Registered'}
    
    if not user_email:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with email: {user_email} not found!')
    
        
    return user_email


@router.put('/zelle/registration/{id}')
def register_for_zelle(id: int, request: schemas.ZelleCreate, db: Session=Depends(database.get_db), current_user: int=Depends(oauth2.get_current_user)):
    user = db.query(models.User).filter(models.User.id == id)
    user.update(request.dict())
    db.commit()
    return user.first()


@router.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session=Depends(database.get_db)):
    admin = db.query(models.User).filter(models.User.isAdmin == True).first()
    
    if admin and user.isAdmin == True:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Administrator already present in database')
    
    hashed_password = utils.hash(user.password)
    user.password = hashed_password
    
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.get('/all', response_model=List[schemas.UserOut])
def get_users(db: Session=Depends(database.get_db)):
    pass


@router.get('/client')
def generate_client_data(db: Session=Depends(database.get_db)):
    client_data =  real_random_address()
    client_data.update({'first_name': names.get_first_name(), 'last_name': names.get_last_name()})
    client_data.update({'email': client_data['first_name'] + client_data['last_name'] + '@gmail.com'})
    client_data.update({'username': client_data['first_name'] + str(random.randint(0,9))})
    client_data.update({'password': 'string'})
    client_data.update({'isAdmin': 0})
    print(client_data)
    print()
    
    client_data.pop('address2', None)
    client_data.pop('coordinates', None)
    print(client_data)
    
    hashed_password = utils.hash(client_data['password'])
    client_data['password'] = hashed_password
    print(client_data)
    
    new_user = models.User(**client_data)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    users = db.query(models.User).all()
    
    return users

@router.get('/{id}', response_model=schemas.UserOut)
def get_user(id: int, db: Session=Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with id: {id} not found!')
    
    return user


@router.get('/auth/isValid', response_model=schemas.UserOut)
def is_user_valid(current_user: str=Depends(oauth2.get_current_user)):
    return current_user


@router.get('/auth/isAdmin')
def is_admin_in_database(db: Session=Depends(database.get_db)):
    admin = db.query(models.User).filter(models.User.isAdmin == True).first()
    
    if not admin:
        return False
    
    return True
