import email
from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    address1: str
    city: str
    state: str
    postalCode: str
    username: str
    password: str
    isAdmin: bool = False
    zelle_registered: bool = False


class UserEmail(BaseModel):
    email: EmailStr


class UserOut(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    username: str
    password: str
    isAdmin: bool
    zelle_registered: bool
    created_at: datetime
    
    class Config:
        orm_mode = True
    

class AccountCreate(BaseModel):
    account_type: str
    balance: float = 0.00


class AccountCreateRecipient(BaseModel):
    email: EmailStr
    balance: float = 0.00


class AccountOut(BaseModel):
    id: int
    account_number: int
    account_type: str
    balance: float
    created_at: datetime
    owner_id: int
    
    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None
    first_name: Optional[str] = None


class TransactionCreate(BaseModel):
    account_id: int
    method: str
    payload: float = 0.00
    previous_balance: float = 0.00


class TransactionCreatePayment(BaseModel):
    email: EmailStr
    payload: float = 0.00


class ZelleCreate(BaseModel):
    zelle_registered: bool = False
    