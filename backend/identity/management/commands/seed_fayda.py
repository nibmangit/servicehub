from django.core.management.base import BaseCommand
from identity.models import FakeFaydaCitizen
from datetime import date


class Command(BaseCommand):

    help = "Create fake Fayda citizens"


    def handle(self, *args, **kwargs):

        citizens = [
            {
                "fin": "ET100001",
                "first_name": "Abebe",
                "middle_name": "Kebede",
                "last_name": "Tesfaye",
                "date_of_birth": date(1998, 5, 20),
                "gender": "Male",
                "phone": "0911223344",
                "email": "abebe@example.com",
                "region": "Amhara",
                "city": "Bahir Dar",
                "woreda": "Bahir Dar City",
                "house_number": "101",
            },

            {
                "fin": "ET100002",
                "first_name": "Almaz",
                "middle_name": "Mulu",
                "last_name": "Bekele",
                "date_of_birth": date(2000, 3, 10),
                "gender": "Female",
                "phone": "0911556677",
                "email": "almaz@example.com",
                "region": "Addis Ababa",
                "city": "Addis Ababa",
                "woreda": "Bole",
                "house_number": "202",
            },
            {
                "fin": "ET100003",
                "first_name": "Kebede",
                "middle_name": "Tadesse",
                "last_name": "Hailu",
                "date_of_birth": date(1995, 8, 15),
                "gender": "Male",
                "phone": "0911889900",
                "email": "kebede@example.com",
                "region": "Oromia",
                "city": "Adama",
                "woreda": "Adama City",
                "house_number": "303",
            },
            {
                "fin": "ET100004",
                "first_name": "Man",
                "middle_name": "Min",
                "last_name": "De",
                "date_of_birth": date(1999, 12, 5),
                "gender": "Male",
                "phone": "0911990011",
                "email": "mulu@example.com",
                "region": "SNNP",
                "city": "Jimma",
                "woreda": "Jimma City",
                "house_number": "404",
            }
        ]


        for citizen_data in citizens:

            citizen, created = FakeFaydaCitizen.objects.get_or_create(
                fin=citizen_data["fin"],
                defaults=citizen_data
            )


            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created Fayda citizen {citizen.fin}"
                    )
                )

            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"Already exists {citizen.fin}"
                    )
                )