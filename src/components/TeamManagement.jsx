import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const TeamManagement = ({ user }) => {
    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState([{ name: "", phone: "" }]);
    const [phone, setPhone] = useState("");
    const [teams, setTeams] = useState([]);
    const [editTeamId, setEditTeamId] = useState(null);

    const navigate = useNavigate();

    // Fetch teams from Firestore
    const fetchTeams = async () => {
        const querySnapshot = await getDocs(collection(db, "teams"));
        setTeams(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    // Handle adding or updating a team
    const handleSaveTeam = async () => {
        if (!teamName.trim() || members.length === 0 || !phone.trim()) {
            alert("Please fill in all fields!");
            return;
        }

        const teamData = {
            teamName,
            members,
            phone,
        };

        if (editTeamId) {
            // Update existing team
            const teamRef = doc(db, "teams", editTeamId);
            await updateDoc(teamRef, teamData);
        } else {
            // Add new team
            await addDoc(collection(db, "teams"), teamData);
        }

        fetchTeams();
        resetForm();
    };

    // Reset form after adding/updating
    const resetForm = () => {
        setTeamName("");
        setMembers([{ name: "", phone: "" }]);
        setPhone("");
        setEditTeamId(null);
    };

    // Handle editing a team
    const handleEditTeam = (team) => {
        setTeamName(team.teamName);
        setMembers(team.members);
        setPhone(team.phone);
        setEditTeamId(team.id);
    };

    // Handle deleting a team
    const handleDeleteTeam = async (teamId) => {
        await deleteDoc(doc(db, "teams", teamId));
        fetchTeams();
    };

    // Handle member input change
    const handleMemberChange = (index, field, value) => {
        setMembers(prevMembers =>
            prevMembers.map((member, i) =>
                i === index ? { ...member, [field]: value } : member
            )
        );
    };

    // Add a new member input field
    const addMemberField = () => {
        setMembers([...members, { name: "", phone: "" }]);
    };

    // Remove a member input field
    const removeMemberField = (index) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    // Logout function
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold">Welcome, {user?.username || "User"}</h2>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>

            {/* Form */}
            <div className="bg-white shadow-md p-6 rounded-lg mt-6 max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold mb-4">{editTeamId ? "Edit Team" : "Create Team"}</h2>

                <input
                    type="text"
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                />

                <input
                    type="text"
                    placeholder="Team Contact"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                />

                <h3 className="text-lg font-medium">Team Members</h3>
                {members.map((member, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            placeholder="Member Name"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                            className="p-2 border rounded w-1/2"
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={member.phone}
                            onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                            className="p-2 border rounded w-1/2"
                        />
                        <button onClick={() => removeMemberField(index)} className="bg-red-500 text-white px-3 py-1 rounded">
                            ✖
                        </button>
                    </div>
                ))}
                <button onClick={addMemberField} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
                    + Add Member
                </button>

                <button onClick={handleSaveTeam} className="bg-green-500 text-white px-4 py-2 rounded w-full mt-4">
                    {editTeamId ? "Update Team" : "Add Team"}
                </button>
            </div>

            {/* Teams List */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Teams</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {teams.map((team) => (
                        <div key={team.id} className="bg-white shadow-md p-4 rounded-lg">
                            <h3 className="text-xl font-semibold">{team.teamName}</h3>
                            <p className="text-gray-500">Contact: {team.phone}</p>
                            <h4 className="text-lg font-medium mt-2">Members:</h4>
                            <ul>
                                {team.members.map((member, index) => (
                                    <li key={index} className="text-gray-700">
                                        {member.name} - {member.phone}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 flex space-x-2">
                                <button onClick={() => handleEditTeam(team)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteTeam(team.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;
