import patientService from '../service/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postBookAppointment(req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}

module.exports = {
    postBookAppointment
}