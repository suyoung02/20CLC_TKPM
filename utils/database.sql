create table USER(
    Gmail varchar(20) not null,
    Password varchar(20) not null,
    Name varchar(20) not null,
    Address varchar(20) not null,
    Phone varchar(11) not null,
    Type int not null,
	primary key (Gmail)
);

create table ORDER_LIST(
	OrderID int not null,
    Gmail varchar(20) not null,
    Dated datetime not null,
    State int not null,
    Payment varchar(20) not null,
	primary key (OrderID, Gmail)
);

create table ORDER_DETAIL(
	OrderID int not null,
    ProID int not null,
    Stock int not null,
	primary key (ProID)
);

create table CART(
	Gmail varchar(20) not null,
    ProID int not null,
    Stock int not null,
	primary key (Gmail, ProID)
);

create table PRODUCT(
	ProID int not null,
    CatID int not null,
    ProName nvarchar(200) not null,
    Price int not null,
    Stock int not null,
    ProState boolean not null,
    Description text not null,
    primary key (ProID)
);

create table CATEGORY(
    CatID int not null,
    CatName varchar(20) not null,
    BigCatID int not null,
	primary key (CatID)
);

create table BIG_CATEGORY(
	BigCatID int not null,
    BigCatName varchar(20) not null,
	primary key (BigCatID)
);