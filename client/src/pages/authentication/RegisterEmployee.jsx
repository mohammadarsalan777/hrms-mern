import { Button } from '@/components/ui/button'
import { registerEmployee } from '@/utils/auth.api'
import React, { useState } from 'react'


const RegisterEmployee = () => {
    const [data, setData] = useState({ email: '', password: '', role: '' })
    const submitHandler = async (e) => {
        e.preventDefault()
        registerEmployee(data).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.error(err);
        }
        )
    }
    return (
        <div>
            <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className='border border-black'
            />
            <input
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className='border border-black'

            />

            <input
                type="text"
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className='border border-black'
            />

            <Button onClick={submitHandler}>Register</Button>
        </div>
    )
}

export default RegisterEmployee
