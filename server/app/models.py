from sqlalchemy import Column, Float, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from .database import Base


class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    address1 = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    postalCode = Column(String, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    isAdmin = Column(Boolean, nullable=False, server_default='False')
    zelle_registered = Column(Boolean, nullable=False, server_default='False')
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    

class Account(Base):
    __tablename__ = 'accounts'
    
    id = Column(Integer, primary_key=True, nullable=False)
    account_number = Column(Integer, nullable=False)
    account_type = Column(String, nullable=False)
    balance = Column(Float, nullable=False, server_default='0.00')
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    owner_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    owner = relationship('User')
    

class Transaction(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    account_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    payload = Column(Float, nullable=False, server_default='0.00')
    method = Column(String, nullable=False)
    previous_balance = Column(Float, nullable=False, server_default='0.00')
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
