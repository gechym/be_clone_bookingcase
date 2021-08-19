import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'
import { raw } from 'body-parser'

let postBookAppointment = (data) => {
    return new Promise( async (thanhcong, thatbai) => {
        try {   
            if(!data.email){
                thanhcong({
                    errCode : -1,
                    message : "LỖI THIẾU THAM SỐ"
                })
            }else{
                // upsert patient
                const user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                      email : data.email,
                      roleId : 'R3'
                    },
                    raw : true
                });


                // Create 
                let [use, isCreate] = user

                if(use){
                    await db.Booking.findOrCreate({
                        where: { patientId:use.id},
                        defaults: {
                            statusId : 'S1',
                            doctorId : data.doctorId,
                            patientId : use.id,
                            date : data.date,
                            timeType : data.timeType
                        },
                        raw : true,
                    })
                }


                thanhcong({
                data : user,
                errCode : 0,
                message : "Thành công"
                })
            }
        } catch (error) {
            console.log(error)
            thatbai()
        }
    })
}

module.exports = {
    postBookAppointment,
}