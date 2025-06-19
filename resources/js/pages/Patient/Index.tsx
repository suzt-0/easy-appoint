export default function patients(){
    const patientData = [
        { id: 1, name: "John Doe", age: 32, gender: "Male" },
        { id: 2, name: "Jane Smith", age: 28, gender: "Female" },
        { id: 3, name: "Alice Johnson", age: 45, gender: "Female" },
        { id: 4, name: "Bob Brown", age: 54, gender: "Male" }
    ];

    return(
        <>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                </tr>
            </thead>
            <tbody>
                {patientData.map((patient) => (
                    <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    );

}