function ParticipantList({
    participants,
    currentRole,
    onAssignRole,
    onRemoveParticipant
}) {

    return (
        <div>
          <h3> Participants</h3>
          {
            participants.map((user) => (
                
                <div
                key={user.username}
                style={{
                    display:"flex",
                    justifyContent:"space-betweem",
                    marginBottom:"10px"
                }}>

                <div>
                 <strong>{user.username}</strong> 

                 {" -"} 

                 {user.role} 
                </div>
                {

               currentRole === "host " && (
                <div>
                    <button
                    onClick={() => 
                        onAssignRole(
                            user.username,
                            "moderator"
                        )
                    }
                    >
                     Make Moderator   
                    </button>

                    <button
                    onClick={() => 
                        onAssignRole(
                            user.username,
                            "participant"
                        )
                    }
                    >
                        Make Participant
                    </button>

                    <button
                    onClick={() =>
                        onRemoveParticipant(
                            user.username
                        )
                    }>
                        Remove
                    </button>
                    </div>
               )    

                }
                </div>
            ))
          }  
        </div>
    );
}

export default ParticipantList;