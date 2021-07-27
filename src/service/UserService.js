import db from '../models/index'
var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise ( async (thanhcong,thatbai) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email) // check Email có tồn tại trong database

            if(isExist){
                
                let user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId'],
                    where :{email : email},
                    raw : true
                })
                if(user){
                    let check = await  bcrypt.compareSync(password, user.password); // kiểm tra password có khới vs db 
                    delete user.password; // xóa password 
                    if(check){
                        userData.errCode = 0
                        userData.errMessage = 'thành công'
                        userData.user = user
                    }else{
                        userData.errCode = 3
                        userData.errMessage = 'sai thông tin email hoặc mật khẩu'
                    }
                }else{
                    userData.errCode = 2
                    userData.errMessage = 'sai thông tin email hoặc mật khẩu'
                }

            }else{
                userData.errCode = 1
                userData.errMessage = 'sai thông tin email hoặc mật khẩu'
            }
            thanhcong(userData)

        } catch (error) {
            thatbai(error)
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise ( async (thanhcong, thaibai) => {
        try {
            let user = await db.User.findOne({
                where : {email : email}
            })

            if(user) {
                thanhcong(true)
            }else{
                thanhcong(false)
            }
        } catch (error) {
            thatbai(error)
        }
    })
}

let getAllUser = (userId) => {
    return new Promise ( async (thanhcong, thatbai) => {
        try {
            let user = '';
            if(userId === 'ALL'){
                user = await db.User.findAll({// tìm tất cả các user
                    raw : true,
                    attributes: {
                        // include: [], // define columns that you want to show
                        exclude: ['password'] // define columns that you don't want 
                    }

                })
            }
            if(userId && userId !== 'ALL'){ // tim user theo id
                user = await db.User.findOne({
                    raw : true,
                    where : {id : userId},
                    attributes: {
                        // include: [], // define columns that you want to show
                        exclude: ['password'] // define columns that you don't want 
                    }
                })
            }
            thanhcong(user)
        } catch (error) {
            thatbai(error)
        }
    })
}

let createNewUser =  (data) => {
    return new Promise ( async (thanhcong, thatbai) => {
        try {
            let check = await checkUserEmail(data.email);
            console.log(check)
            if(check === true){// check email có tồn tại không 
                console.log('check')
                thanhcong({
                    errCode : 1,
                    messageCode : "Email này đã tồn tại"
                })
            }else{
                let hashUserPasswordByBcrypt = await hashUserPassword(data.password); // đợi lbr bcrypt băm pw ra đã
                await db.User.create({  
                    email: data.email,
                    password: hashUserPasswordByBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                    phonenumber: data.phonenumber,
                })
                thanhcong({
                    errCode:0,
                    errMessage: ' oke'
                })
            }
        } catch (error) {
            thatbai(error)
        }
    })
} 

let deleteUser = (id) => {
    return new Promise ( async (thanhcong,thatbai) => {
        try {
            let user = await db.User.findOne({
                where:{id : id}
            })
            if(!user){
                thanhcong({
                    errCode : 2,
                    errMessage : 'Người dùng không tồn tại'
                })
            }
            if(user){
                await user.destroy()
                thanhcong({
                    errCode : 0,
                    messageCode : 'Xóa thành công'
                })
            }
        } catch (error) {
            thatbai(error)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (thanhcong,thatbai) => {
        try {
            if(!data.id){
                thanhcong({
                    errCode : 0,
                    messageCode : 'update thành công'
                })    
            }
            let user = await db.User.findOne({
                where : {id : data.id}
            })
            if(!user){
                thanhcong({
                    errCode : 1,
                    messageCode : 'Người dùng không tồn tại'
                })
            }
            
            user.firstName = data.firstName
            user.lastName = data.lastName
            user.address = data.address

            await user.save();

            thanhcong({
                errCode : 0,
                messageCode : 'update thành công'
            })
            
        } catch (e) {
            thatbai(e)
        }
    })
}

///

let hashUserPassword = (pw) => { // băm lại mật khẩu 
    return new Promise((thanhcong, thatbai) => { // trả về một promise 
        try {
            var hash = bcrypt.hashSync(pw, salt); // sử lý băm pw
            thanhcong(hash) // trả về pw đã được băm 
        } catch (error) {
            thatbai(error) // nếu lỗi trả về error exception
        }
    })
}


module.exports = {
    handleUserLogin,
    getAllUser,
    createNewUser,
    deleteUser,
    updateUser
}