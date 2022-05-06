import { useContext } from 'react';
import { UserContext } from './UserContext';

export function UserInfo() {
    const {user, setUser} = useContext(UserContext)

    return (
        <div>
            <pre>
                {setUser(user)}
            </pre>
        </div>
    )
}
