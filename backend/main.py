from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.barbershop
appointments_collection = db.appointments

class Appointment(BaseModel):
    id: str | None = None
    customer: str
    phone: str
    datetime: str
    service: str

@app.post("/appointments", response_model=Appointment)
async def create_appointment(appointment: Appointment):
    # prevent double booking for the same datetime
    existing = await appointments_collection.find_one({"datetime": appointment.datetime})
    if existing:
        raise HTTPException(status_code=400, detail="Time slot already booked")

    data = appointment.dict(exclude={"id"})
    result = await appointments_collection.insert_one(data)
    appointment.id = str(result.inserted_id)
    return appointment

@app.get("/appointments", response_model=list[Appointment])
async def list_appointments():
    appointments = []
    async for doc in appointments_collection.find():
        doc["id"] = str(doc["_id"])
        appointments.append(Appointment(**doc))
    return appointments

@app.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    result = await appointments_collection.delete_one({"_id": ObjectId(appointment_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"status": "deleted"}
